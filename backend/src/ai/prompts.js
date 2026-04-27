export const PROMPT_VERSION = "2026-04-25.2";

export const REQUIRED_CHAT_FIELDS = [
  "business name",
  "client name",
  "first item description",
  "first item rate",
];

export const EXTRACT_SYSTEM_PROMPT = `Extract invoice fields from the user input.
- Return JSON only.
- Include only explicit or strongly implied fields.
- Use the compact invoice schema.
- Keep items concise.
- Currency must be an ISO code.
- Use numeric strings for quantity, rate, and taxRate.
- Do not calculate totals.`;

export const REFINE_SYSTEM_PROMPT = `Update only the invoice fields changed by the instruction.
- Return JSON only.
- Return only changed fields.
- Use the compact invoice schema.
- Use numeric strings for quantity, rate, and taxRate.
- Do not calculate totals.
- CRITICAL: NEVER concatenate address data into a name field. name, address1, and address2 are always separate fields. If copying an address block, set each field individually.
- IMPORTANT: If the instruction asks to copy an address from one section to another (e.g. "use client address as ship to", "use shipping address as billing", "same address as client", "in ship to use client name and address"), copy the EXACT name, address1, and address2 values from the source section into the target section as separate fields. Do NOT use placeholders like "[Shipping Address]".
- IMPORTANT: If the instruction asks to add or update a field but does not provide the actual value (e.g. "add bank details", "add address", "add one more item", "add a line item for consulting" without a rate), respond with a JSON object containing only: {"clarification_needed": "<short question asking for the specific missing value(s)>"}.
- If the user asks to remove or delete a field or section (e.g. "remove bank details", "remove ship to", "remove item 2"), clear those fields by setting them to empty strings or empty arrays.
- If the user asks to set the total directly (e.g. "make total 5000"), respond with: {"clarification_needed": "The total is calculated automatically from your items and tax. To change the total, please update the item rates or quantities instead."}.
- If the instruction references an item by description (e.g. "change the logo item rate to 800"), match it by description in the items array and update the correct index.
- If the instruction is about currency conversion (e.g. "change currency to INR"), only update the currency code — do not convert or change any amounts.
- If the instruction is too vague to map to any invoice field (e.g. "make it look professional", "make it better"), respond with: {"clarification_needed": "Could you be more specific? For example: update the business name, change the tax rate, or add a new item."}.
- If the instruction is a general question unrelated to editing the invoice (e.g. "what is GST?", "how do I send this?"), respond with: {"clarification_needed": "I can only help edit your invoice fields. For that question, please use a general search engine."}.`;

export const buildExtractPrompt = ({ input, today, dueDate, knownData }) => {
  const segments = [
    `v=${PROMPT_VERSION}`,
    `today=${today}`,
    `defaultDueDate=${dueDate}`,
  ];

  if (knownData) {
    segments.push(`known=${JSON.stringify(knownData)}`);
  }

  segments.push(`input=${input}`);
  return segments.join("\n");
};

export const buildRefinePrompt = ({
  currentData,
  instruction,
  today,
  dueDate,
}) =>
  [
    `v=${PROMPT_VERSION}`,
    `today=${today}`,
    `defaultDueDate=${dueDate}`,
    `current=${JSON.stringify(currentData)}`,
    `instruction=${instruction}`,
  ].join("\n");

export const OPTIONAL_FIELD_LABELS = {
  businessAddress: "business address",
  clientAddress: "client address",
  invoiceNumber: "invoice number",
  tax: "tax rate",
  terms: "payment terms",
  dueDate: "due date",
  bankDetails: "bank details",
};

export const buildMissingRequiredFieldsQuestion = (
  missingFields,
  knownOptional = [],
) => {
  if (missingFields.length === 0) return "";

  const fieldList = missingFields.map((f) => `- ${f}`).join("\n");

  const missingOptional = Object.values(OPTIONAL_FIELD_LABELS).filter(
    (label) => !knownOptional.includes(label),
  );

  const optionalNote =
    missingOptional.length > 0
      ? `\n\nOptionally you can also provide: ${missingOptional.join(", ")} — otherwise I'll use defaults.`
      : "";

  return `To generate your invoice I just need:\n${fieldList}${optionalNote}\n\nShare these and I'll have it ready instantly.`;
};
