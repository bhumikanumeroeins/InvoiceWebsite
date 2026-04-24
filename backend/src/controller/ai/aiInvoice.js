import { GoogleGenerativeAI } from "@google/generative-ai";

// In-memory IP usage tracker for public (unauthenticated) usage
// { ip: { count, resetAt } }
const publicUsage = new Map();
const PUBLIC_LIMIT = 10;
const RESET_HOURS = 24;

const getPublicUsage = (ip) => {
  const now = Date.now();
  const entry = publicUsage.get(ip);
  if (!entry || now > entry.resetAt) {
    const fresh = { count: 0, resetAt: now + RESET_HOURS * 60 * 60 * 1000 };
    publicUsage.set(ip, fresh);
    return fresh;
  }
  return entry;
};

const getModel = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set in environment variables");
  return new GoogleGenerativeAI(key).getGenerativeModel({ model: "gemini-2.5-flash-lite" });
};

// The content fields Gemini is allowed to fill
const CONTENT_SCHEMA = `{
  "currency": "string (ISO 4217 code e.g. USD, INR, EUR, GBP, AED, AUD, CAD, SGD, JPY, CNY — detect from symbols or country context in the description)",
  "invoiceTitle": "string",
  "invoiceNumber": "string",
  "invoiceDate": "string (e.g. Jan 29, 2026)",
  "dueDate": "string (e.g. Feb 28, 2026)",
  "poNumber": "string",
  "businessName": "string",
  "businessAddress1": "string",
  "businessAddress2": "string",
  "clientName": "string",
  "clientAddress1": "string",
  "clientAddress2": "string",
  "shipToName": "string",
  "shipToAddress1": "string",
  "shipToAddress2": "string",
  "item1Desc": "string",
  "item1Qty": "string (number)",
  "item1Rate": "string (number)",
  "item1Amount": "string (calculated: item1Qty × item1Rate)",
  "item2Desc": "string",
  "item2Qty": "string (number)",
  "item2Rate": "string (number)",
  "item2Amount": "string (calculated: item2Qty × item2Rate)",
  "item3Desc": "string",
  "item3Qty": "string (number)",
  "item3Rate": "string (number)",
  "item3Amount": "string (calculated: item3Qty × item3Rate)",
  "item4Desc": "string",
  "item4Qty": "string (number)",
  "item4Rate": "string (number)",
  "item4Amount": "string (calculated: item4Qty × item4Rate)",
  "taxLabel": "string (e.g. 'Tax (18%):' — include % in label)",
  "subtotal": "string (sum of all item amounts)",
  "tax": "string (calculated tax amount)",
  "total": "string (subtotal + tax)",
  "terms": "string",
  "bankName": "string",
  "accountNumber": "string",
  "ifscCode": "string",
  "footerEmail": "string",
  "footerPhone": "string",
  "footerWebsite": "string",
  "templateName": "string (short descriptive name for this invoice)"
}`;

const SYSTEM_PROMPT = `You are an invoice data extractor. Given a user's description, extract invoice details and return ONLY a valid JSON object matching this schema:
${CONTENT_SCHEMA}

Rules:
- Return ONLY the JSON object, no markdown, no explanation, no code blocks
- Only include fields you can confidently extract from the description
- For dates, use format like "Jan 29, 2026"
- For amounts, return plain numbers as strings e.g. "500.00"
- If the user mentions more than 2 items, use item3Desc/item3Qty/item3Rate and item4Desc/item4Qty/item4Rate for extra items
- If a field is not mentioned, omit it from the response
- taxLabel must include the percentage e.g. "Tax (18%):"
- templateName should be a short name like "Web Design Invoice - Acme Corp"
- For currency: detect from symbols ($ → USD, ₹ → INR, € → EUR, £ → GBP, ¥ → JPY), country names (India → INR, UAE → AED, Australia → AUD), or explicit mentions. Default to USD if unclear
- If no tax is mentioned, set taxLabel to "Tax (0%):", tax to "0.00", and total = subtotal

IMPORTANT - CALCULATIONS:
- For each item, calculate itemNAmount = itemNQty × itemNRate (e.g. item1Amount = item1Qty × item1Rate)
- Calculate subtotal = sum of all item amounts
- If tax is mentioned, extract the percentage and calculate tax amount = subtotal × (tax% / 100)
- Calculate total = subtotal + tax
- Return all amounts as strings with 2 decimal places e.g. "1500.00"
- If qty is not mentioned for an item, assume qty = 1`;

const REFINE_PROMPT = `You are an invoice editor. Given the current invoice data and a user instruction, return an updated JSON object with ONLY the fields that need to change.

Current invoice data:
{CURRENT_DATA}

User instruction: {INSTRUCTION}

Rules:
- Return ONLY a valid JSON object with the changed fields, no markdown, no explanation
- Only return fields that actually need to change based on the instruction
- For amounts, return plain numbers as strings e.g. "500.00"
- taxLabel must include the percentage e.g. "Tax (18%):"
- If the instruction is unclear, make a reasonable interpretation
- If any item qty/rate changes, recalculate that item's amount (itemNAmount = itemNQty × itemNRate), then recalculate subtotal, tax, and total
- If tax rate changes, recalculate tax amount and total`;

export const generateInvoice = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Please provide a description of your invoice" });
    }

    const today = new Date();
    const due = new Date(today);
    due.setDate(due.getDate() + 30);
    const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const todayStr = fmt(today);
    const dueStr = fmt(due);

    const model = getModel();
    const result = await model.generateContent(
      `${SYSTEM_PROMPT}\n\nToday's date is ${todayStr}. If invoice date is not mentioned, use ${todayStr}. If due date is not mentioned, use ${dueStr} (30 days from today).\n\nUser description: ${prompt}`
    );
    const text = result.response.text().trim();

    const cleaned = text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "").trim();

    let content;
    try {
      content = JSON.parse(cleaned);
    } catch {
      console.error("Gemini returned non-JSON:", text);
      return res.status(500).json({ success: false, message: "AI returned an unexpected response. Please try again." });
    }

    return res.status(200).json({ success: true, data: content });
  } catch (error) {
    console.error("AI generate error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to generate invoice" });
  }
};

export const refineInvoice = async (req, res) => {
  try {
    const { currentContent, instruction } = req.body;

    if (!instruction || instruction.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Please provide a refinement instruction" });
    }

    if (!currentContent) {
      return res.status(400).json({ success: false, message: "Current invoice content is required" });
    }

    const model = getModel();
    const filledPrompt = REFINE_PROMPT
      .replace("{CURRENT_DATA}", JSON.stringify(currentContent, null, 2))
      .replace("{INSTRUCTION}", instruction);

    const result = await model.generateContent(filledPrompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "").trim();

    let updates;
    try {
      updates = JSON.parse(cleaned);
    } catch {
      console.error("Gemini refine returned non-JSON:", text);
      return res.status(500).json({ success: false, message: "AI returned an unexpected response. Please try again." });
    }

    return res.status(200).json({ success: true, data: updates });
  } catch (error) {
    console.error("AI refine error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to refine invoice" });
  }
};

// ─── TEMPLATE FIELD DEFINITIONS ───────────────────────────────────────────────
const TEMPLATE_FIELDS = `
REQUIRED — must come from the user, never invent these:
  - businessName    : Who is issuing the invoice
  - clientName      : Who is being billed
  - item1Desc       : At least one service/product description
  - item1Rate       : Price for that item (real number from user)
  - currency        : Detect from symbols/country, or ask

OPTIONAL — can be filled with placeholder values (tell user which ones):
  - item1Qty           → default "1"
  - invoiceDate        → today's date
  - dueDate            → 30 days from today
  - invoiceNumber      → "INV-001"
  - invoiceTitle       → "Invoice"
  - taxLabel / tax     → "Tax (0%):" / "0.00" unless user mentions tax
  - businessAddress1/2 → "[Your Address]"
  - clientAddress1/2   → "[Client Address]"
  - terms              → "Payment due within 30 days"
  - templateName       → auto from context

NEVER fill — leave empty, user updates after sign-in:
  - shipToName / shipToAddress
  - poNumber
  - bankName / accountNumber / ifscCode
  - footerEmail / footerPhone / footerWebsite
  - item2–4 fields (only if user explicitly mentions multiple items)
`;

// ─── CHAT SYSTEM PROMPT ────────────────────────────────────────────────────────
const CHAT_SYSTEM_PROMPT = `You are a friendly invoice assistant that fills invoice templates through conversation.

Follow this exact flow:

━━ STEP 1: EXTRACT ━━
From the full conversation, extract every field you can confidently identify.

━━ STEP 2: DECIDE ━━

CASE A — Any REQUIRED field is still missing (businessName, clientName, item description, item price, currency):
→ action: "ask"
→ Write a conversational message that does THREE things in this order:
  1. Ask for the missing required fields clearly
  2. List the optional fields you CAN fill with placeholder values (offer the user a chance to provide them)
  3. End with a question like "Want to provide any of these, or should I go ahead and fill them with placeholders?"

Example tone:
"Got it! I just need a couple more things:
• What's your **business name** and your **client's name**?
• What's the **service or product** you're billing for, and at what **price**?

I can also fill these with placeholder values if you'd like to skip them for now:
• Your business address → [Your Address]
• Client address → [Client Address]  
• Invoice number → INV-001
• Due date → 30 days from today

Want to provide any of the above, or shall I go ahead and generate with placeholders?"

CASE B — All required fields are present (from this or earlier messages):
→ action: "generate"
→ Use real user values for required fields
→ Use defaults/placeholders for optional fields not provided
→ Leave "never fill" fields empty
→ In your message, naturally list what was filled with placeholders

CASE C — User says "go ahead", "proceed", "yes", "fill with placeholders", or similar:
→ action: "generate" immediately, even if optional fields are missing
→ Use whatever required fields were provided earlier in the conversation

RULES:
- NEVER invent businessName, clientName, item description, or price
- Ask only ONCE — if user already answered (even partially), go to generate
- Keep tone friendly and conversational, use bullet points and bold for clarity
- The full conversation history is your memory

${TEMPLATE_FIELDS}

RESPONSE FORMAT — return ONLY valid JSON, no markdown outside the JSON:

For "ask":
{
  "action": "ask",
  "extracted": { ...fields already identified from conversation... },
  "question": "Your full conversational message (plain text, can use markdown like **bold** and bullet points)"
}

For "generate":
{
  "action": "generate",
  "data": { ...all invoice fields per schema below... },
  "placeholders": ["field keys that used placeholder/default — not user-provided"],
  "message": "Friendly confirmation. Example: 'Here's your invoice! I filled **businessAddress**, **clientAddress**, and **invoiceNumber** with placeholder values — you can update these anytime after signing in.'"
}

Invoice data schema:
${CONTENT_SCHEMA}

CALCULATION RULES:
- itemNAmount = itemNQty × itemNRate
- subtotal = sum of all item amounts
- tax = subtotal × (tax% / 100), or "0.00" if no tax
- total = subtotal + tax
- All money as strings with 2 decimal places: "500.00"
- Default qty = "1" if not mentioned
- taxLabel must include %: "Tax (18%):" or "Tax (0%):"
- invoiceDate = today, dueDate = 30 days from today (unless user specifies)`;



export const chatInvoice = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const usage = getPublicUsage(ip);

    if (usage.count >= PUBLIC_LIMIT) {
      return res.status(429).json({
        success: false,
        limitReached: true,
        message: `You've used all ${PUBLIC_LIMIT} free generations. Sign in to continue.`,
        remaining: 0,
      });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: "Messages are required" });
    }

    const today = new Date();
    const due = new Date(today);
    due.setDate(due.getDate() + 30);
    const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Build full conversation text for Gemini
    const conversationText = messages
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const model = getModel();
    const result = await model.generateContent(
      `${CHAT_SYSTEM_PROMPT}\n\nToday: ${fmt(today)}, Default due date: ${fmt(due)}\n\nConversation so far:\n${conversationText}\n\nRespond with JSON only:`
    );

    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Gemini chat returned non-JSON:", text);
      return res.status(500).json({ success: false, message: "AI returned an unexpected response. Please try again." });
    }

    // Only count usage when invoice is actually generated
    if (parsed.action === 'generate') {
      usage.count += 1;
    }

    return res.status(200).json({
      success: true,
      action: parsed.action,                  // "generate" | "ask"
      data: parsed.data || null,              // full invoice data when action=generate
      extracted: parsed.extracted || null,    // partial data when action=ask (for partial preview)
      question: parsed.question || null,      // clarifying question when action=ask
      message: parsed.message || null,        // confirmation message when action=generate
      placeholders: parsed.placeholders || [],
      remaining: PUBLIC_LIMIT - usage.count,
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to process request" });
  }
};

// Public version of generate (no auth, rate-limited)
export const generateInvoicePublic = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const usage = getPublicUsage(ip);

    if (usage.count >= PUBLIC_LIMIT) {
      return res.status(429).json({
        success: false,
        limitReached: true,
        message: `You've used all ${PUBLIC_LIMIT} free generations. Sign in to continue.`,
        remaining: 0,
      });
    }

    const { prompt } = req.body;
    if (!prompt || prompt.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Please provide a description of your invoice" });
    }

    const today = new Date();
    const due = new Date(today);
    due.setDate(due.getDate() + 30);
    const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const model = getModel();
    const result = await model.generateContent(
      `${SYSTEM_PROMPT}\n\nToday's date is ${fmt(today)}. If invoice date is not mentioned, use ${fmt(today)}. If due date is not mentioned, use ${fmt(due)} (30 days from today).\n\nUser description: ${prompt}`
    );
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "").trim();

    let content;
    try {
      content = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ success: false, message: "AI returned an unexpected response. Please try again." });
    }

    usage.count += 1;

    return res.status(200).json({
      success: true,
      data: content,
      remaining: PUBLIC_LIMIT - usage.count,
    });
  } catch (error) {
    console.error("AI public generate error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to generate invoice" });
  }
};
