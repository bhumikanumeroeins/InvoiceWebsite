const InvoiceDetailsBlock = ({
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  const gray = "#374151";

  return (
    <div style={{ width: 260 }}>
      {[
        ["Invoice#", invoiceNumber],
        ["Invoice Date", invoiceDate],
        ["P.O#", poNumber],
        ["Due Date", dueDate],
      ].map(([l, v]) => (
        <div key={l} style={{ display: "flex", marginBottom: 6 }}>
          <span style={{ width: 110, fontWeight: 700 }}>{l}</span>
          <span>{v}</span>
        </div>
      ))}
    </div>
  );
};

export default InvoiceDetailsBlock;
