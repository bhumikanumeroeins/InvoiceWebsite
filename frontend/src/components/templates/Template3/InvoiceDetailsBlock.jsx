const InvoiceDetailsBlock = ({
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  const navy = "#12498e";
  const coral = "#ff6b6b";

  return (
    <div style={{ padding: "20px 50px 0" }}>
      <div style={{ display: "flex", marginBottom: 8 }}>
        <div style={{ width: "50%", display: "flex" }}>
          <span style={{ color: coral, width: 100 }}>INVOICE#</span>
          <span style={{ color: navy }}>{invoiceNumber}</span>
        </div>

        <div style={{ width: "50%", display: "flex" }}>
          <span style={{ color: navy, width: 80 }}>P.O#</span>
          <span style={{ color: navy }}>{poNumber}</span>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", display: "flex" }}>
          <span style={{ color: navy, width: 100 }}>Invoice Date</span>
          <span style={{ color: navy }}>{invoiceDate}</span>
        </div>

        <div style={{ width: "50%", display: "flex" }}>
          <span style={{ color: navy, width: 80 }}>Due Date</span>
          <span style={{ color: navy }}>{dueDate}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsBlock;
