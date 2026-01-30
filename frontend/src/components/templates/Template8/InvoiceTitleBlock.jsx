const InvoiceTitleBlock = ({
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  return (
    <div
      style={{
        width: 630,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        {[
          ["Invoice#", invoiceNumber],
          ["Invoice Date", invoiceDate],
          ["P.O#", poNumber],
          ["Due Date", dueDate],
        ].map(([l, v]) => (
          <div key={l}>
            {l}: <strong>{v}</strong>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 56, fontWeight: 900 }}>
        INVOICE
      </div>
    </div>
  );
};

export default InvoiceTitleBlock;
