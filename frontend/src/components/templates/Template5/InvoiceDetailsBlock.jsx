const InvoiceDetailsBlock = ({
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  return (
    <div style={{ width: 555, display: "flex", justifyContent: "space-between" }}>
      <div>
        {[
          ["Invoice#", invoiceNumber],
          ["Invoice Date", invoiceDate],
          ["P.O#", poNumber],
          ["Due Date", dueDate],
        ].map(([l, v]) => (
          <div key={l} style={{ display: "flex", gap: 8 }}>
            <strong>{l}</strong>
            <span>{v}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 48 }}>INVOICE</p>
    </div>
  );
};

export default InvoiceDetailsBlock;
