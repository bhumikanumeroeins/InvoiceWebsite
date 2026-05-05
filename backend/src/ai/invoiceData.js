import {
  CANONICAL_REQUIRED_CHAT_FIELDS,
  INVOICE_FIELD_KEYS,
  ITEM_INDICES,
  ITEM_LIMIT,
  PLACEHOLDER_TRACKED_FIELDS,
  SUPPORTED_CURRENCIES,
} from "./invoiceSchema.js";

const SIMPLE_CANONICAL_FIELDS = [
  "currency",
  "invoiceTitle",
  "invoiceNumber",
  "invoiceDate",
  "dueDate",
  "poNumber",
  "taxRate",
  "terms",
  "templateName",
];

const REQUIRED_CHAT_FIELD_LABELS = {
  "business.name": "business name",
  "client.name": "client name",
  "items.0.description": "first item description",
  "items.0.rate": "first item rate",
  currency: "currency",
};

const CURRENCY_ALIASES = {
  USD: "USD",
  DOLLAR: "USD",
  DOLLARS: "USD",
  US: "USD",
  INR: "INR",
  RUPEE: "INR",
  RUPEES: "INR",
  RS: "INR",
  INRR: "INR",
  EUR: "EUR",
  EURO: "EUR",
  EUROS: "EUR",
  GBP: "GBP",
  POUND: "GBP",
  POUNDS: "GBP",
  AUD: "AUD",
  CAD: "CAD",
  SGD: "SGD",
  AED: "AED",
  DIRHAM: "AED",
  DIRHAMS: "AED",
  JPY: "JPY",
  YEN: "JPY",
  CNY: "CNY",
  YUAN: "CNY",
};

const PLACEHOLDER_PATHS = {
  currency: "currency",
  invoiceNumber: "invoiceNumber",
  invoiceDate: "invoiceDate",
  dueDate: "dueDate",
  businessAddress1: "business.address1",
  businessAddress2: "business.address2",
  clientAddress1: "client.address1",
  clientAddress2: "client.address2",
  taxLabel: "taxRate",
  terms: "terms",
  templateName: "templateName",
};

const hasOwn = (object, key) =>
  Object.prototype.hasOwnProperty.call(object, key);

const trimString = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const parseLooseNumber = (value, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const normalized = trimString(value)
    .replace(/,/g, "")
    .replace(/[^\d.+-]/g, "");
  if (!normalized) {
    return fallback;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatMoney = (value) => parseLooseNumber(value, 0).toFixed(2);

const formatQuantity = (value) => {
  const numericValue = parseLooseNumber(value, 0);
  const rounded = Math.round(numericValue * 1000) / 1000;
  if (Number.isInteger(rounded)) {
    return String(rounded);
  }
  return rounded.toFixed(3).replace(/\.?0+$/, "");
};

const formatTaxRate = (value) => {
  const numericValue = parseLooseNumber(value, 0);
  if (Number.isInteger(numericValue)) {
    return String(numericValue);
  }
  return numericValue.toFixed(2).replace(/\.?0+$/, "");
};

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const normalizeDateString = (value, fallback = "") => {
  const text = trimString(value);
  if (!text) {
    return fallback;
  }

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) {
    return text;
  }

  return formatDate(parsed);
};

const cloneDeep = (value) => JSON.parse(JSON.stringify(value ?? null));

const sanitizeCurrency = (value, fallback = "USD") => {
  const text = trimString(value).toUpperCase();
  if (SUPPORTED_CURRENCIES.includes(text)) {
    return text;
  }

  const aliasMatch = CURRENCY_ALIASES[text];
  if (aliasMatch) {
    return aliasMatch;
  }

  return fallback;
};

const toDaysFromToday = (days, baseDate = new Date()) => {
  const dueDate = new Date(baseDate);
  dueDate.setDate(dueDate.getDate() + days);
  return formatDate(dueDate);
};

const isCanonicalInvoiceShape = (value) =>
  !!value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  (hasOwn(value, "business") ||
    hasOwn(value, "client") ||
    hasOwn(value, "shipTo") ||
    hasOwn(value, "payment") ||
    hasOwn(value, "footer") ||
    hasOwn(value, "items") ||
    hasOwn(value, "taxRate"));

const isAddressPlaceholder = (value) => {
  const text = trimString(value);
  if (!text) return true;
  return (
    /^\[.*\]$/.test(text) ||
    /^(your business address|client address|shipping address|city, state, zip|city, state)$/i.test(
      text,
    )
  );
};

const splitAddressLines = (address1 = "", address2 = "") => {
  const line1 = trimString(address1);
  const line2 = trimString(address2);
  const shouldSplit = line1 && (!line2 || isAddressPlaceholder(line2));
  if (!shouldSplit) {
    return { address1: line1, address2: line2 };
  }

  const newlineParts = line1.split(/\r?\n/).map(trimString).filter(Boolean);
  if (newlineParts.length >= 2) {
    return {
      address1: newlineParts[0],
      address2: newlineParts.slice(1).join(", "),
    };
  }

  const commaParts = line1
    .split(/\s*,\s*/)
    .map(trimString)
    .filter(Boolean);
  if (commaParts.length >= 2) {
    if (commaParts.length >= 4) {
      return {
        address1: commaParts.slice(0, commaParts.length - 3).join(", "),
        address2: commaParts.slice(commaParts.length - 3).join(", "),
      };
    }
    return {
      address1: commaParts.slice(0, commaParts.length - 1).join(", "),
      address2: commaParts.slice(commaParts.length - 1).join(", "),
    };
  }

  if (line1.length > 40) {
    const words = line1.split(/\s+/).filter(Boolean);
    const splitIndex = Math.ceil(words.length / 2);
    return {
      address1: words.slice(0, splitIndex).join(" "),
      address2: words.slice(splitIndex).join(" "),
    };
  }

  return { address1: line1, address2: "" };
};

const normalizeContactBlock = (block = {}, partial = false, fallback = {}) => {
  if (!block || typeof block !== "object" || Array.isArray(block)) {
    return partial ? undefined : { name: "", address1: "", address2: "" };
  }

  const normalized = {};
  for (const key of ["name", "address1", "address2"]) {
    if (partial && !hasOwn(block, key)) {
      continue;
    }
    const providedValue = hasOwn(block, key) ? trimString(block[key]) : "";
    const value =
      !partial && !providedValue
        ? trimString(fallback[key])
        : providedValue || trimString(fallback[key] || "");
    if (value || !partial) {
      normalized[key] = value;
    }
  }

  if (normalized.address1) {
    const split = splitAddressLines(normalized.address1, normalized.address2);
    normalized.address1 = split.address1;
    normalized.address2 = split.address2;
  }

  return normalized;
};

const normalizePaymentBlock = (block = {}, partial = false, fallback = {}) => {
  if (!block || typeof block !== "object" || Array.isArray(block)) {
    return partial
      ? undefined
      : { bankName: "", accountNumber: "", ifscCode: "" };
  }

  const normalized = {};
  for (const key of ["bankName", "accountNumber", "ifscCode"]) {
    if (partial && !hasOwn(block, key)) {
      continue;
    }
    const providedValue = hasOwn(block, key) ? trimString(block[key]) : "";
    const value =
      !partial && !providedValue
        ? trimString(fallback[key])
        : providedValue || trimString(fallback[key] || "");
    if (value || !partial) {
      normalized[key] = value;
    }
  }

  return normalized;
};

const normalizeFooterBlock = (block = {}, partial = false, fallback = {}) => {
  if (!block || typeof block !== "object" || Array.isArray(block)) {
    return partial ? undefined : { email: "", phone: "", website: "" };
  }

  const normalized = {};
  for (const key of ["email", "phone", "website"]) {
    if (partial && !hasOwn(block, key)) {
      continue;
    }
    const providedValue = hasOwn(block, key) ? trimString(block[key]) : "";
    const value =
      !partial && !providedValue
        ? trimString(fallback[key])
        : providedValue || trimString(fallback[key] || "");
    if (value || !partial) {
      normalized[key] = value;
    }
  }

  return normalized;
};

const normalizeItems = (items, partial = false) => {
  if (!Array.isArray(items)) {
    return partial ? undefined : [];
  }

  const normalizedItems = [];

  for (let index = 0; index < Math.min(items.length, ITEM_LIMIT); index += 1) {
    const item = items[index];
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      normalizedItems.push(partial ? {} : undefined);
      continue;
    }

    const normalizedItem = {};

    if (!partial || hasOwn(item, "description")) {
      const description = trimString(item.description);
      if (description || !partial) {
        normalizedItem.description = description;
      }
    }

    if (!partial || hasOwn(item, "quantity")) {
      const quantity = trimString(item.quantity);
      if (quantity || !partial) {
        normalizedItem.quantity = quantity ? formatQuantity(quantity) : "";
      }
    }

    if (!partial || hasOwn(item, "rate")) {
      const rate = trimString(item.rate);
      if (rate || !partial) {
        normalizedItem.rate = rate ? formatMoney(rate) : "";
      }
    }

    if (Object.keys(normalizedItem).length > 0 || !partial) {
      normalizedItems.push(normalizedItem);
    }
  }

  return normalizedItems.filter(
    (item, index) => item !== undefined || index < ITEM_LIMIT,
  );
};

const getItemField = (index, suffix) => `item${index}${suffix}`;

const legacyToCanonicalInvoice = (raw = {}, options = {}) => {
  const partial = options.partial === true;
  const canonical = {};

  for (const key of SIMPLE_CANONICAL_FIELDS) {
    if (key === "taxRate") {
      if (partial) {
        if (hasOwn(raw, "taxLabel")) {
          canonical.taxRate = formatTaxRate(extractTaxRate(raw.taxLabel));
        }
      } else {
        canonical.taxRate = formatTaxRate(extractTaxRate(raw.taxLabel));
      }
      continue;
    }

    if (partial && !hasOwn(raw, key)) {
      continue;
    }

    const value = trimString(raw[key]);
    if (value || !partial) {
      canonical[key] = value;
    }
  }

  const contactMappings = [
    ["business", "businessName", "businessAddress1", "businessAddress2"],
    ["client", "clientName", "clientAddress1", "clientAddress2"],
    ["shipTo", "shipToName", "shipToAddress1", "shipToAddress2"],
  ];

  for (const [field, nameKey, address1Key, address2Key] of contactMappings) {
    const block = {};
    if (!partial || hasOwn(raw, nameKey)) block.name = raw[nameKey];
    if (!partial || hasOwn(raw, address1Key)) block.address1 = raw[address1Key];
    if (!partial || hasOwn(raw, address2Key)) block.address2 = raw[address2Key];

    const normalizedBlock = normalizeContactBlock(block, partial);
    if (normalizedBlock && Object.keys(normalizedBlock).length > 0) {
      canonical[field] = normalizedBlock;
    }
  }

  const items = [];
  for (const index of ITEM_INDICES) {
    const item = {};
    const descKey = getItemField(index, "Desc");
    const qtyKey = getItemField(index, "Qty");
    const rateKey = getItemField(index, "Rate");

    if (!partial || hasOwn(raw, descKey)) item.description = raw[descKey];
    if (!partial || hasOwn(raw, qtyKey)) item.quantity = raw[qtyKey];
    if (!partial || hasOwn(raw, rateKey)) item.rate = raw[rateKey];

    if (
      Object.values(item).some((value) => trimString(value).length > 0) ||
      (!partial && index === 1)
    ) {
      items[index - 1] = item;
    }
  }

  const normalizedItems = normalizeItems(items, partial);
  if (normalizedItems !== undefined && normalizedItems.length > 0) {
    canonical.items = normalizedItems;
  }

  const paymentBlock = normalizePaymentBlock(
    {
      ...(partial && !hasOwn(raw, "bankName")
        ? {}
        : { bankName: raw.bankName }),
      ...(partial && !hasOwn(raw, "accountNumber")
        ? {}
        : { accountNumber: raw.accountNumber }),
      ...(partial && !hasOwn(raw, "ifscCode")
        ? {}
        : { ifscCode: raw.ifscCode }),
    },
    partial,
  );
  if (paymentBlock && Object.keys(paymentBlock).length > 0) {
    canonical.payment = paymentBlock;
  }

  const footerBlock = normalizeFooterBlock(
    {
      ...(partial && !hasOwn(raw, "footerEmail")
        ? {}
        : { email: raw.footerEmail }),
      ...(partial && !hasOwn(raw, "footerPhone")
        ? {}
        : { phone: raw.footerPhone }),
      ...(partial && !hasOwn(raw, "footerWebsite")
        ? {}
        : { website: raw.footerWebsite }),
    },
    partial,
  );
  if (footerBlock && Object.keys(footerBlock).length > 0) {
    canonical.footer = footerBlock;
  }

  return canonical;
};

export const buildInvoiceDefaults = (baseDate = new Date()) => ({
  currency: "USD",
  invoiceTitle: "Invoice",
  invoiceNumber: "INV-001",
  invoiceDate: formatDate(baseDate),
  dueDate: toDaysFromToday(30, baseDate),
  poNumber: "[PO-XXXX]",
  taxRate: "0",
  terms: "Payment due within 30 days",
  templateName: "AI Invoice",
  business: {
    name: "",
    address1: "[Your Business Address]",
    address2: "[City, State, ZIP]",
  },
  client: {
    name: "",
    address1: "[Client Address]",
    address2: "[City, State, ZIP]",
  },
  shipTo: {
    name: "[Ship To Name]",
    address1: "[Shipping Address]",
    address2: "[City, State, ZIP]",
  },
  items: [],
  payment: {
    bankName: "[Bank Name]",
    accountNumber: "[Account Number]",
    ifscCode: "[IFSC / Routing Code]",
  },
  footer: {
    email: "[your@email.com]",
    phone: "[Phone Number]",
    website: "[www.yourwebsite.com]",
  },
});

const getRawCanonicalInvoice = (raw, partial = false) =>
  isCanonicalInvoiceShape(raw)
    ? cloneDeep(raw) || {}
    : legacyToCanonicalInvoice(raw, { partial });

export const extractTaxRate = (value) => {
  const text = trimString(value);
  if (!text) {
    return 0;
  }

  if (/no\s+tax|without\s+tax|tax\s+exempt/i.test(text)) {
    return 0;
  }

  const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
  if (!match) {
    return parseLooseNumber(text, 0);
  }
  return parseLooseNumber(match[1], 0);
};

export const normalizeCanonicalInvoice = (raw, options = {}) => {
  const defaults = options.defaults || buildInvoiceDefaults();
  const partial = options.partial === true;
  const source = getRawCanonicalInvoice(raw, partial);
  const normalized = {};

  for (const key of SIMPLE_CANONICAL_FIELDS) {
    if (partial && !hasOwn(source, key)) {
      continue;
    }

    const fallback = partial ? "" : defaults[key] || "";
    const rawValue = hasOwn(source, key) ? source[key] : fallback;

    switch (key) {
      case "currency":
        normalized.currency = sanitizeCurrency(rawValue, fallback || "USD");
        break;
      case "invoiceDate":
      case "dueDate":
        normalized[key] = normalizeDateString(rawValue, fallback);
        break;
      case "taxRate":
        normalized.taxRate = trimString(rawValue)
          ? formatTaxRate(rawValue)
          : fallback;
        break;
      default:
        normalized[key] = trimString(rawValue || fallback);
        break;
    }
  }

  const nestedFields = [
    ["business", normalizeContactBlock],
    ["client", normalizeContactBlock],
    ["shipTo", normalizeContactBlock],
    ["payment", normalizePaymentBlock],
    ["footer", normalizeFooterBlock],
  ];

  for (const [field, normalizer] of nestedFields) {
    if (partial && !hasOwn(source, field)) {
      continue;
    }

    const fallback = partial ? undefined : defaults[field];
    const normalizedField = normalizer(
      hasOwn(source, field) ? source[field] : fallback,
      partial,
      fallback,
    );
    if (normalizedField && Object.keys(normalizedField).length > 0) {
      normalized[field] = normalizedField;
    } else if (!partial && fallback) {
      normalized[field] = fallback;
    }
  }

  if (!partial || hasOwn(source, "items")) {
    const fallbackItems = partial ? undefined : defaults.items;
    const normalizedItems = normalizeItems(
      hasOwn(source, "items") ? source.items : fallbackItems,
      partial,
    );
    if (normalizedItems !== undefined && normalizedItems.length > 0) {
      normalized.items = normalizedItems.slice(0, ITEM_LIMIT).map((item) => {
        if (partial) {
          const partialItem = {};
          if (hasOwn(item || {}, "description")) {
            partialItem.description = trimString(item?.description);
          }
          if (hasOwn(item || {}, "quantity")) {
            partialItem.quantity = trimString(item?.quantity)
              ? formatQuantity(item.quantity)
              : "";
          }
          if (hasOwn(item || {}, "rate")) {
            partialItem.rate = trimString(item?.rate)
              ? formatMoney(item.rate)
              : "";
          }
          return partialItem;
        }

        return {
          description: trimString(item?.description),
          quantity: trimString(item?.quantity)
            ? formatQuantity(item.quantity)
            : "",
          rate: trimString(item?.rate) ? formatMoney(item.rate) : "",
        };
      });
    } else if (!partial) {
      normalized.items = [];
    }
  }

  return normalized;
};

const canonicalItemHasData = (item) =>
  !!item &&
  typeof item === "object" &&
  ["description", "quantity", "rate"].some(
    (key) => trimString(item[key]).length > 0,
  );

export const canonicalToLegacyInvoice = (raw, options = {}) => {
  const defaults = options.defaults || buildInvoiceDefaults();
  const partial = options.partial === true;
  const canonical = normalizeCanonicalInvoice(raw, { defaults, partial });
  const legacy = {};

  const setValue = (key, value) => {
    const text = trimString(value);
    if (text || !partial) {
      legacy[key] = text;
    }
  };

  setValue("currency", canonical.currency);
  setValue("invoiceTitle", canonical.invoiceTitle);
  setValue("invoiceNumber", canonical.invoiceNumber);
  setValue("invoiceDate", canonical.invoiceDate);
  setValue("dueDate", canonical.dueDate);
  setValue("poNumber", canonical.poNumber);
  setValue("templateName", canonical.templateName);
  setValue("terms", canonical.terms);

  setValue("businessName", canonical.business?.name);
  setValue("businessAddress1", canonical.business?.address1);
  setValue("businessAddress2", canonical.business?.address2);
  setValue("clientName", canonical.client?.name);
  setValue("clientAddress1", canonical.client?.address1);
  setValue("clientAddress2", canonical.client?.address2);
  setValue("shipToName", canonical.shipTo?.name);
  setValue("shipToAddress1", canonical.shipTo?.address1);
  setValue("shipToAddress2", canonical.shipTo?.address2);
  setValue("bankName", canonical.payment?.bankName);
  setValue("accountNumber", canonical.payment?.accountNumber);
  setValue("ifscCode", canonical.payment?.ifscCode);
  setValue("footerEmail", canonical.footer?.email);
  setValue("footerPhone", canonical.footer?.phone);
  setValue("footerWebsite", canonical.footer?.website);

  const items = Array.isArray(canonical.items)
    ? canonical.items.slice(0, ITEM_LIMIT)
    : [];
  let subtotal = 0;

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (!canonicalItemHasData(item)) {
      continue;
    }

    const quantity = trimString(item.quantity)
      ? parseLooseNumber(item.quantity, 1)
      : 1;
    const rate = parseLooseNumber(item.rate, 0);
    const amount = quantity * rate;
    const itemNumber = index + 1;

    setValue(getItemField(itemNumber, "Desc"), item.description);
    setValue(getItemField(itemNumber, "Qty"), formatQuantity(quantity));
    setValue(getItemField(itemNumber, "Rate"), formatMoney(rate));
    setValue(getItemField(itemNumber, "Amount"), formatMoney(amount));

    subtotal += amount;
  }

  if (!partial || trimString(canonical.taxRate)) {
    const taxRate = parseLooseNumber(canonical.taxRate, 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    setValue("taxLabel", `Tax (${formatTaxRate(taxRate)}%):`);
    setValue("subtotal", formatMoney(subtotal));
    setValue("tax", formatMoney(tax));
    setValue("total", formatMoney(total));
  }

  return legacy;
};

export const normalizeInvoiceData = (raw, options = {}) =>
  canonicalToLegacyInvoice(raw, options);

const mergeObjects = (current, updates) => ({
  ...(current || {}),
  ...(updates || {}),
});

const isPlaceholderAddressLine = (value) => {
  const text = trimString(value);
  return (
    !text ||
    /^\[.*\]$/.test(text) ||
    /^(city,?\s*state,?\s*zip|city,?\s*state)$/i.test(text)
  );
};

const getUpdatedContactBlock = (currentBlock = {}, updateBlock = {}) => {
  const merged = mergeObjects(currentBlock, updateBlock);

  if (
    hasOwn(updateBlock, "address1") &&
    !hasOwn(updateBlock, "address2") &&
    isPlaceholderAddressLine(currentBlock.address2)
  ) {
    merged.address2 = "";
  }

  return merged;
};

export const mergeCanonicalInvoices = (current, updates) => {
  const currentCanonical = normalizeCanonicalInvoice(current, {
    partial: true,
  });
  const updateCanonical = normalizeCanonicalInvoice(updates, { partial: true });

  const merged = {
    ...currentCanonical,
    ...updateCanonical,
    business: getUpdatedContactBlock(
      currentCanonical.business,
      updateCanonical.business,
    ),
    client: getUpdatedContactBlock(
      currentCanonical.client,
      updateCanonical.client,
    ),
    shipTo: getUpdatedContactBlock(
      currentCanonical.shipTo,
      updateCanonical.shipTo,
    ),
    payment: mergeObjects(currentCanonical.payment, updateCanonical.payment),
    footer: mergeObjects(currentCanonical.footer, updateCanonical.footer),
  };

  if (Array.isArray(updateCanonical.items)) {
    const currentItems = Array.isArray(currentCanonical.items)
      ? currentCanonical.items.slice()
      : [];
    const maxLength = Math.max(
      currentItems.length,
      updateCanonical.items.length,
    );
    const mergedItems = [];

    for (let index = 0; index < Math.min(maxLength, ITEM_LIMIT); index += 1) {
      const nextItem = updateCanonical.items[index];
      const currentItem = currentItems[index] || {};

      if (!nextItem || Object.keys(nextItem).length === 0) {
        if (canonicalItemHasData(currentItem)) {
          mergedItems[index] = currentItem;
        }
        continue;
      }

      mergedItems[index] = {
        ...currentItem,
        ...nextItem,
      };
    }

    merged.items = mergedItems.filter((item) => canonicalItemHasData(item));
  }

  return merged;
};

export const applyInvoiceRefinement = (
  currentContent,
  updates,
  defaults = {},
) => {
  const currentNormalized = normalizeInvoiceData(currentContent, {
    defaults,
    partial: false,
  });
  const mergedCanonical = mergeCanonicalInvoices(currentContent, updates);
  const mergedNormalized = normalizeInvoiceData(mergedCanonical, {
    defaults,
    partial: false,
  });
  const diff = {};

  for (const key of INVOICE_FIELD_KEYS) {
    if ((mergedNormalized[key] || "") !== (currentNormalized[key] || "")) {
      diff[key] = mergedNormalized[key];
    }
  }

  return diff;
};

const getValueAtPath = (object, path) =>
  path.split(".").reduce((value, segment) => {
    if (value === null || value === undefined) {
      return undefined;
    }
    if (Array.isArray(value) && /^\d+$/.test(segment)) {
      return value[Number(segment)];
    }
    return value[segment];
  }, object);

export const hasRequiredInvoiceFields = (content) => {
  const canonical = normalizeCanonicalInvoice(content, { partial: true });
  return CANONICAL_REQUIRED_CHAT_FIELDS.every(
    (path) => trimString(getValueAtPath(canonical, path)).length > 0,
  );
};

export const getMissingRequiredFields = (content) => {
  const canonical = normalizeCanonicalInvoice(content, { partial: true });
  return CANONICAL_REQUIRED_CHAT_FIELDS.filter(
    (path) => trimString(getValueAtPath(canonical, path)).length === 0,
  ).map((path) => REQUIRED_CHAT_FIELD_LABELS[path] || path);
};

const PLACEHOLDER_PATTERNS =
  /^\[.+\]$|^your (business )?address$|^client address$|^inv-001$|^today$|^30 days from today$|^city,?\s*state,?\s*zip$/i;

export const derivePlaceholderFields = (
  normalizedLegacy,
  rawCanonical,
  defaults = buildInvoiceDefaults(),
) => {
  const normalizedCanonical = normalizeCanonicalInvoice(normalizedLegacy, {
    defaults,
    partial: false,
  });
  const rawNormalized = normalizeCanonicalInvoice(rawCanonical, {
    partial: true,
  });
  const placeholders = [];

  for (const field of PLACEHOLDER_TRACKED_FIELDS) {
    const path = PLACEHOLDER_PATHS[field];
    const rawValue = trimString(getValueAtPath(rawNormalized, path));
    const normalizedValue =
      field === "taxLabel"
        ? `Tax (${formatTaxRate(getValueAtPath(normalizedCanonical, path) || 0)}%):`
        : trimString(getValueAtPath(normalizedCanonical, path));
    const defaultValue =
      field === "taxLabel"
        ? `Tax (${formatTaxRate(getValueAtPath(defaults, path) || 0)}%):`
        : trimString(getValueAtPath(defaults, path));

    const isPlaceholder =
      !rawValue ||
      normalizedValue === defaultValue ||
      PLACEHOLDER_PATTERNS.test(rawValue) ||
      PLACEHOLDER_PATTERNS.test(normalizedValue);

    if (isPlaceholder) {
      placeholders.push(field);
    }
  }

  return placeholders;
};

export const buildAiMessage = ({ placeholders = [], updated = false }) => {
  if (updated) {
    return "Updated your invoice.";
  }

  if (!placeholders.length) {
    return "Your invoice is ready.";
  }

  const preview = placeholders.slice(0, 3).join(", ");
  const suffix =
    placeholders.length > 3 ? ", and a few other optional fields" : "";
  return `Your invoice is ready. I used placeholders for ${preview}${suffix}.`;
};

const detectCurrencyFromText = (text) => {
  if (/[₹]/.test(text)) return "INR";
  if (/[€]/.test(text)) return "EUR";
  if (/[£]/.test(text)) return "GBP";
  if (/[¥]/.test(text)) return "JPY";
  if (/\bAED\b|dirham/i.test(text)) return "AED";
  if (/\bAUD\b|australian dollar/i.test(text)) return "AUD";
  if (/\bCAD\b|canadian dollar/i.test(text)) return "CAD";
  if (/\bSGD\b|singapore dollar/i.test(text)) return "SGD";
  if (/\bCNY\b|yuan/i.test(text)) return "CNY";
  if (/\bINR\b|\brupees?\b|\bindia\b/i.test(text)) return "INR";
  if (/\bEUR\b|\beuros?\b/i.test(text)) return "EUR";
  if (/\bGBP\b|\bpounds?\b/i.test(text)) return "GBP";
  if (/\bUSD\b|\bdollars?\b|\$/.test(text)) return "USD";
  return "";
};

const cleanupEntityName = (value) =>
  trimString(value)
    .replace(/^the\s+/i, "")
    .replace(/^client\s+(?:is|name is)\s+/i, "")
    .replace(/^business\s+(?:is|name is)\s+/i, "")
    .replace(/\s+(?:at|for|with)\s*$/i, "")
    .trim();

const looksLikeNonItemSegment = (segment) =>
  /\b(?:invoice|client(?:\s+is|\s+name)?|business(?:\s+is|\s+name)?|from\s+\w|to\s+\w|due\s+(?:in|date|within)|tax\s+(?:rate|is)|gst\s+(?:is|rate)|vat\s+(?:is|rate)|currency|bank\s+transfer|payment\s+terms)\b/i.test(
    segment,
  );

const extractItemsFromText = (text) => {
  const items = [];
  const segments = text
    .split(/[,\n;]/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  for (let rawSegment of segments) {
    const preambleStripped = rawSegment.replace(
      /^(?:invoice\s+)?from\s+[^,]+?\s+to\s+[^,]+?\s+for\s+/i,
      "",
    );
    const segment = preambleStripped.trim() || rawSegment;

    if (looksLikeNonItemSegment(segment)) {
      continue;
    }

    let match = segment.match(
      /^(.+?)\s+(\d+(?:\.\d+)?)\s*(?:hours|hour|hrs|hr|qty|units|x)\s+at\s+[$₹€£¥]?\s*(\d+(?:\.\d+)?)/i,
    );
    if (match) {
      items.push({
        description: cleanupEntityName(match[1]),
        quantity: formatQuantity(match[2]),
        rate: formatMoney(match[3]),
      });
      continue;
    }

    match = segment.match(/^(.+?)\s+[$₹€£¥]\s*(\d+(?:\.\d+)?)(?!\s*%)/i);
    if (match) {
      items.push({
        description: cleanupEntityName(match[1]),
        quantity: "1",
        rate: formatMoney(match[2]),
      });
      continue;
    }

    match = segment.match(
      /^(.+?)\s+(\d+(?:\.\d+)?)(?!\s*%)(?:\s*(?:usd|inr|eur|gbp|aud|cad|sgd|aed|jpy|cny))$/i,
    );
    if (match) {
      items.push({
        description: cleanupEntityName(match[1]),
        quantity: "1",
        rate: formatMoney(match[2]),
      });
    }
  }

  return items.slice(0, ITEM_LIMIT);
};

const extractNameBlocks = (text) => {
  const result = {};

  // Match "from X to Y" but stop the client capture at "for", "for the", etc.
  // so item descriptions after "for" don't bleed into the client name.
  const fromToMatch = text.match(
    /\bfrom\s+([^,.\n]+?)\s+to\s+([^,.\n]+?)(?:\s+for\b|[,.\n]|$)/i,
  );
  if (fromToMatch) {
    result.business = {
      ...(result.business || {}),
      name: cleanupEntityName(fromToMatch[1]),
    };
    result.client = {
      ...(result.client || {}),
      name: cleanupEntityName(fromToMatch[2]),
    };
  }

  const clientMatch = text.match(
    /\bclient(?:\s+is|\s+name\s+is|:)\s*([^,.\n]+?)(?:[,.\n]|$)/i,
  );
  if (clientMatch) {
    result.client = {
      ...(result.client || {}),
      name: cleanupEntityName(clientMatch[1]),
    };
  }

  const businessMatch = text.match(
    /\bbusiness(?:\s+is|\s+name\s+is|:)\s*([^,.\n]+?)(?:[,.\n]|$)/i,
  );
  if (businessMatch) {
    result.business = {
      ...(result.business || {}),
      name: cleanupEntityName(businessMatch[1]),
    };
  }

  return result;
};

const extractDateHints = (text, baseDate = new Date()) => {
  const result = {};
  const dueInMatch = text.match(/\bdue\s+(?:in|within)\s+(\d{1,3})\s+days?\b/i);
  if (dueInMatch) {
    result.dueDate = toDaysFromToday(Number(dueInMatch[1]), baseDate);
  }

  const netMatch = text.match(/\bnet\s+(\d{1,3})\b/i);
  if (netMatch) {
    result.dueDate = toDaysFromToday(Number(netMatch[1]), baseDate);
    result.terms = `Net ${Number(netMatch[1])}`;
  }

  return result;
};

export const extractHeuristicInvoiceData = (text, options = {}) => {
  const input = trimString(text);
  if (!input) {
    return {};
  }

  const baseDate = options.baseDate || new Date();
  const result = {
    ...extractNameBlocks(input),
    ...extractDateHints(input, baseDate),
  };

  const currency = detectCurrencyFromText(input);
  if (currency) {
    result.currency = currency;
  }

  if (/no\s+tax|without\s+tax|tax\s+exempt/i.test(input)) {
    result.taxRate = "0";
  } else {
    const taxMatch = input.match(/(\d+(?:\.\d+)?)\s*%\s*(?:tax|gst|vat)?/i);
    if (taxMatch) {
      result.taxRate = formatTaxRate(taxMatch[1]);
    }
  }

  const items = extractItemsFromText(input);
  if (items.length > 0) {
    result.items = items;
  }

  return normalizeCanonicalInvoice(result, { partial: true });
};

const detectCurrencyFromInstruction = (instruction) => {
  const match = instruction.match(
    /\bcurrency\s+to\s+([a-zA-Z]{3,}|rupees?|dollars?|euros?|pounds?|dirhams?|yen|yuan)\b/i,
  );
  if (!match) {
    return "";
  }

  return sanitizeCurrency(match[1], "");
};

const extractNamedValue = (instruction, label) => {
  const pattern = new RegExp(`\\b${label}\\s+to\\s+(.+)$`, "i");
  const match = instruction.match(pattern);
  return match ? trimString(match[1]) : "";
};

export const extractDeterministicRefinement = (
  instruction,
  currentContent,
  options = {},
) => {
  const text = trimString(instruction);
  if (!text) {
    return null;
  }

  const defaults = options.defaults || buildInvoiceDefaults();
  const updates = {};

  const currency = detectCurrencyFromInstruction(text);
  if (currency) {
    updates.currency = currency;
  }

  if (/no\s+tax|remove\s+tax/i.test(text)) {
    updates.taxRate = "0";
  } else {
    const taxMatch = text.match(
      /\b(?:tax|gst|vat)\s+(?:to|at)\s+(\d+(?:\.\d+)?)\s*%/i,
    );
    if (taxMatch) {
      updates.taxRate = formatTaxRate(taxMatch[1]);
    }
  }

  const daysMatch =
    text.match(/\bdue\s+date\s+to\s+(\d{1,3})\s+days?\s+from\s+today\b/i) ||
    text.match(/\bdue\s+in\s+(\d{1,3})\s+days?\b/i);
  if (daysMatch) {
    updates.dueDate = toDaysFromToday(Number(daysMatch[1]));
  }

  const explicitDateMatch = text.match(/\bchange\s+due\s+date\s+to\s+(.+)$/i);
  if (explicitDateMatch && !daysMatch) {
    updates.dueDate = normalizeDateString(
      explicitDateMatch[1],
      defaults.dueDate,
    );
  }

  const netMatch =
    text.match(/\bmake\s+terms\s+net\s+(\d{1,3})\b/i) ||
    text.match(/\bnet\s+(\d{1,3})\b/i);
  if (netMatch) {
    const days = Number(netMatch[1]);
    updates.terms = `Net ${days}`;
    if (!updates.dueDate) {
      updates.dueDate = toDaysFromToday(days);
    }
  }

  const termsMatch = text.match(
    /\b(?:set|change|update)\s+terms\s+to\s+(.+)$/i,
  );
  if (termsMatch) {
    updates.terms = trimString(termsMatch[1]);
  }

  const clientName = extractNamedValue(text, "client name");
  if (clientName) {
    updates.client = { name: clientName };
  }

  const businessName = extractNamedValue(text, "business name");
  if (businessName) {
    updates.business = { name: businessName };
  }

  const invoiceNumber = extractNamedValue(text, "invoice number");
  if (invoiceNumber) {
    updates.invoiceNumber = invoiceNumber;
  }

  const itemQtyMatch = text.match(
    /\bitem\s+(\d)\s+qty\s+to\s+(\d+(?:\.\d+)?)\b/i,
  );
  if (itemQtyMatch) {
    const index = Number(itemQtyMatch[1]) - 1;
    updates.items = updates.items || [];
    updates.items[index] = {
      ...(updates.items[index] || {}),
      quantity: formatQuantity(itemQtyMatch[2]),
    };
  }

  const itemRateMatch = text.match(
    /\bitem\s+(\d)\s+rate\s+to\s+[$₹€£¥]?\s*(\d+(?:\.\d+)?)\b/i,
  );
  if (itemRateMatch) {
    const index = Number(itemRateMatch[1]) - 1;
    updates.items = updates.items || [];
    updates.items[index] = {
      ...(updates.items[index] || {}),
      rate: formatMoney(itemRateMatch[2]),
    };
  }

  // Address copy patterns — covers many natural phrasings
  const current = normalizeCanonicalInvoice(currentContent, { partial: true });

  // Helper: strip placeholder values from a contact block
  const PLACEHOLDER_RE = /^\[.+\]$|^\[.*address.*\]$|^\[.*city.*\]$/i;
  const cleanContactBlock = (block) => {
    if (!block) return null;
    const name = trimString(block.name);
    const address1 = trimString(block.address1);
    const address2 = trimString(block.address2);
    // If name looks like it has address data concatenated into it, extract just the first segment
    const cleanName =
      name.includes("[") || name.split(/[.\n]/).length > 2
        ? name.split(/[.\n]/)[0].trim()
        : name;
    return {
      name: cleanName,
      address1: PLACEHOLDER_RE.test(address1) ? "" : address1,
      address2: PLACEHOLDER_RE.test(address2) ? "" : address2,
    };
  };

  const copyAddressPatterns = [
    // client → shipTo
    {
      from: "client",
      to: "shipTo",
      pattern:
        /\b(?:use|copy|set|put|fill|same)\b.{0,40}\b(?:client|billing|bill\s*to)\b.{0,30}\b(?:in\s+)?(?:ship(?:ping)?(?:\s+to)?|ship\s+to)\b/i,
    },
    // shipTo → client
    {
      from: "shipTo",
      to: "client",
      pattern:
        /\b(?:use|copy|set|put|fill|same)\b.{0,40}\b(?:ship(?:ping)?(?:\s+to)?|ship\s+to)\b.{0,30}\b(?:in\s+)?(?:client|billing|bill\s*to)\b/i,
    },
    // business → client
    {
      from: "business",
      to: "client",
      pattern:
        /\b(?:use|copy|set|put|fill|same)\b.{0,40}\b(?:business|from|sender|my)\b.{0,30}\b(?:in\s+)?(?:client|billing|bill\s*to)\b/i,
    },
    // client → business
    {
      from: "client",
      to: "business",
      pattern:
        /\b(?:use|copy|set|put|fill|same)\b.{0,40}\b(?:client|billing|bill\s*to)\b.{0,30}\b(?:in\s+)?(?:business|from|sender)\b/i,
    },
    // "ship to same as client" / "shipping same as billing"
    {
      from: "client",
      to: "shipTo",
      pattern:
        /\bship(?:ping)?(?:\s+to)?\s+(?:same\s+as|=|is\s+same\s+as)\s+(?:client|billing|bill\s*to)\b/i,
    },
    // "client same as shipping"
    {
      from: "shipTo",
      to: "client",
      pattern:
        /\bclient\s+(?:same\s+as|=|is\s+same\s+as)\s+(?:ship(?:ping)?(?:\s+to)?)\b/i,
    },
  ];

  for (const { from, to, pattern } of copyAddressPatterns) {
    if (pattern.test(text)) {
      const cleaned = cleanContactBlock(current[from]);
      const fieldMap = {
        client: ["clientName", "clientAddress1", "clientAddress2"],
        shipTo: ["shipToName", "shipToAddress1", "shipToAddress2"],
        business: ["businessName", "businessAddress1", "businessAddress2"],
      };

      if (cleaned && cleaned.name) {
        const [nameKey, addr1Key, addr2Key] = fieldMap[to];

        // If source has no real address (only placeholders stripped),
        // try the reverse direction — user may have the intent backwards
        if (!cleaned.address1 && !cleaned.address2) {
          const reverseCleaned = cleanContactBlock(current[to]);
          if (reverseCleaned && reverseCleaned.address1) {
            const [rNameKey, rAddr1Key, rAddr2Key] = fieldMap[from];
            return {
              [rNameKey]: reverseCleaned.name,
              [rAddr1Key]: reverseCleaned.address1,
              [rAddr2Key]: reverseCleaned.address2,
            };
          }
          // Neither side has real address data — fall through to AI
          break;
        }

        // Return flat legacy fields directly — bypass applyInvoiceRefinement
        // so an identical-looking source/target still produces a real update
        return {
          [nameKey]: cleaned.name,
          [addr1Key]: cleaned.address1,
          [addr2Key]: cleaned.address2,
        };
      }
      break;
    }
  }

  // Payment field patterns — bank name, account number, IFSC/routing code
  const bankNameMatch = text.match(
    /\b(?:bank(?:\s+name)?|bank\s+is)\s+(?:as\s+|to\s+|is\s+)?(.+?)(?:\s*,|\s+and\b|\s+account|\s+ifsc|\s*$)/i,
  );
  if (bankNameMatch) {
    updates.payment = {
      ...(updates.payment || {}),
      bankName: trimString(bankNameMatch[1]),
    };
  }

  const accountNumberMatch = text.match(
    /\b(?:account\s+(?:number|no\.?|#)|a\/c\s+(?:number|no\.?|#)?)\s+(?:as\s+|to\s+|is\s+)?(\S+)/i,
  );
  if (accountNumberMatch) {
    updates.payment = {
      ...(updates.payment || {}),
      accountNumber: trimString(accountNumberMatch[1]),
    };
  }

  const ifscMatch = text.match(
    /\b(?:ifsc|routing)\s+(?:code\s+)?(?:as\s+|to\s+|is\s+)?(\S+)/i,
  );
  if (ifscMatch) {
    updates.payment = {
      ...(updates.payment || {}),
      ifscCode: trimString(ifscMatch[1]),
    };
  }

  if (Object.keys(updates).length === 0) {
    return null;
  }

  return applyInvoiceRefinement(currentContent, updates, defaults);
};
