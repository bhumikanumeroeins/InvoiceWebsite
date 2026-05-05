/**
 * Extracts raw flat item values from the data prop for inline editing.
 * Falls back to getInvoiceData-computed items for display.
 */
export const getRawItems = (data, computedItems = []) =>
  [0, 1, 2, 3].map((i) => ({
    desc: data[`item${i + 1}Desc`] ?? computedItems[i]?.description ?? "",
    qty: data[`item${i + 1}Qty`] ?? String(computedItems[i]?.quantity ?? "1"),
    rate: data[`item${i + 1}Rate`] ?? String(computedItems[i]?.rate ?? ""),
  }));

/**
 * Returns only the rows that have actual content (desc or rate filled).
 * The trailing empty row is NOT included — use AddItemButton instead.
 */
export const getEditableRows = (rawItems) => {
  const lastFilledIndex = rawItems.reduce(
    (last, row, i) => (row.desc || row.rate ? i : last),
    -1,
  );
  return rawItems.slice(0, lastFilledIndex + 1);
};

/**
 * Returns the index of the next empty slot (for adding a new item), or -1 if all 4 are filled.
 */
export const getNextEmptyIndex = (rawItems) => {
  const idx = rawItems.findIndex((r) => !r.desc && !r.rate);
  return idx; // -1 if all slots used
};

/**
 * A button that reveals the next empty item row for editing.
 * Clicking it sets item{n}Desc to a space so getEditableRows includes it,
 * then the user can type the real description.
 */
export const AddItemButton = ({ rawItems, onFieldChange, colSpan = 4 }) => {
  const nextIndex = getNextEmptyIndex(rawItems);
  if (nextIndex === -1) return null; // all 4 slots used

  const handleAdd = () => {
    if (onFieldChange) {
      // Set desc to a single space so the row becomes visible; user replaces it
      onFieldChange(`item${nextIndex + 1}Desc`, " ");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "6px 8px",
        borderBottom: "1px dashed #d1d5db",
      }}
    >
      <button
        onClick={handleAdd}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#6366f1",
          fontSize: "12px",
          fontWeight: "600",
          padding: "4px 8px",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(99,102,241,0.08)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        title="Add another line item"
      >
        <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
        Add item
      </button>
    </div>
  );
};

/**
 * Renders an editable items table body.
 * In readOnly mode renders the computed items; in edit mode renders raw editable cells
 * followed by an AddItemButton.
 */
export const renderItems = ({
  readOnly,
  items, // computed from getInvoiceData
  rawItems, // from getRawItems()
  currencySymbol,
  onFieldChange,
  EditableText,
  rowStyle = {},
  cellStyles = { qty: {}, desc: {}, rate: {}, amount: {} },
}) => {
  const f = (field) => (val) => onFieldChange && onFieldChange(field, val);

  if (readOnly) {
    return items.map((item, i) => (
      <div key={i} style={{ display: "flex", ...rowStyle }}>
        <div style={cellStyles.qty}>{item.quantity}</div>
        <div style={cellStyles.desc}>{item.description}</div>
        <div style={cellStyles.rate}>
          {currencySymbol}
          {typeof item.rate === "number"
            ? item.rate.toLocaleString("en-IN", { minimumFractionDigits: 2 })
            : item.rate}
        </div>
        <div style={cellStyles.amount}>
          {currencySymbol}
          {typeof item.amount === "number"
            ? item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })
            : item.amount}
        </div>
      </div>
    ));
  }

  const editableRows = getEditableRows(rawItems);

  return editableRows.map((raw, i) => (
    <div key={i} style={{ display: "flex", ...rowStyle }}>
      <div style={cellStyles.qty}>
        <EditableText
          value={raw.qty}
          onChange={f(`item${i + 1}Qty`)}
          readOnly={false}
          placeholder="1"
        />
      </div>
      <div style={cellStyles.desc}>
        <EditableText
          value={raw.desc.trim()}
          onChange={f(`item${i + 1}Desc`)}
          readOnly={false}
          placeholder="Description"
        />
      </div>
      <div style={cellStyles.rate}>
        <EditableText
          value={raw.rate}
          onChange={f(`item${i + 1}Rate`)}
          readOnly={false}
          placeholder="0.00"
        />
      </div>
      <div style={cellStyles.amount}>
        {currencySymbol}
        {((parseFloat(raw.qty) || 1) * (parseFloat(raw.rate) || 0)).toFixed(2)}
      </div>
    </div>
  ));
};
