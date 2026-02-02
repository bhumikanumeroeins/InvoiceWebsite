const InvoiceDetailsBlock = ({
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  const navy = "#12498e";
  const coral = "#ff6b6b";

  return (
    <div style={{ padding: "20px 50px 0", borderTop: "1px solid #19d3c5", 
    marginTop: 6, }}>
      <div style={{ display: "flex", marginBottom: 8 }}>
        <div style={{ width: "50%", display: "flex" }}>
          <span style={{ color: coral, width: 100, fontFamily: "'Orbitron', sans-serif", fontWeight: 800}}>INVOICE#</span>
          <span style={{ color: navy }}>{invoiceNumber}</span>
        </div>

        <div style={{ width: "50%", display: "flex" }}>
          <span style={{ color: navy, width: 80, fontWeight: 700 }}>P.O#</span>
          <span style={{ color: navy }}>{poNumber}</span>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", display: "flex" }}>
          <span style={{ color: navy, width: 100, fontWeight: 700 }}>Invoice Date</span>
          <span style={{ color: navy }}>{invoiceDate}</span>
        </div>

        <div style={{ width: "50%", display: "flex" }}>
          <span style={{ color: navy, width: 80, fontWeight: 700 }}>Due Date</span>
          <span style={{ color: navy }}>{dueDate}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsBlock;
