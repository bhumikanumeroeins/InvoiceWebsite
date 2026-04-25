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
- IMPORTANT: If the instruction asks to add or update a field but does not provide the actual value (e.g. "add bank details", "add address", "add one more item"), respond with a JSON object containing a single key "clarification_needed" with a short question asking for the specific value. Example: {"clarification_needed": "What are your bank details? Please provide bank name, account number, and IFSC code."}`;

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
