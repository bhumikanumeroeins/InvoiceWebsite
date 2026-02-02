const InvoiceDetailsBlock = ({
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  const purple = "#6b5cff"; // adjust slightly if needed to match curve bg

  return (
    <div
      style={{
        width: 555,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {/* LEFT DETAILS */}
      <div>
        {[
          ["Invoice#", invoiceNumber],
          ["Invoice Date", invoiceDate],
          ["P.O#", poNumber],
          ["Due Date", dueDate],
        ].map(([l, v]) => (
          <div
            key={l}
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <strong style={{ color: purple }}>{l}</strong>
            <span>{v}</span>
          </div>
        ))}
      </div>

      {/* RIGHT TITLE */}
      <p
        style={{
          fontSize: 48,
          margin: 0,
          fontWeight: 700,
          color: purple,
          letterSpacing: 1,
        }}
      >
        INVOICE
      </p>
    </div>
  );
};

export default InvoiceDetailsBlock;
