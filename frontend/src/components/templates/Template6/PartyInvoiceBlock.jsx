const PartyInvoiceBlock = ({
  billToName,
  billToAddress,
  shipToName,
  shipToAddress,
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  return (
    <div
      style={{
        width: 694,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        columnGap: 24,
      }}
    >
      {/* BILL TO */}
      <div>
        <strong style={{ fontWeight: 400 }}>Bill To</strong>

        <p style={{ fontWeight: 600, margin: "2px 0" }}>
          {billToName}
        </p>

        <p style={{ fontWeight: 500, margin: 0 }}>
          {billToAddress}
        </p>
      </div>

      {/* SHIP TO */}
      <div>
        <strong style={{ fontWeight: 400 }}>Ship To</strong>

        <p style={{ fontWeight: 600, margin: "2px 0" }}>
          {shipToName}
        </p>

        <p style={{ fontWeight: 500, margin: 0 }}>
          {shipToAddress}
        </p>
      </div>

      {/* INVOICE */}
      <div style={{ textAlign: "right" }}>
        <h2 style={{ fontWeight: 800, margin: "0 0 6px" }}>
          INVOICE
        </h2>

        <p style={{ margin: "2px 0" }}>
          <strong>Invoice#:</strong> {invoiceNumber}
        </p>

        <p style={{ margin: "2px 0" }}>
          <strong>Invoice Date:</strong> {invoiceDate}
        </p>

        <p style={{ margin: "2px 0" }}>
          <strong>P.O#:</strong> {poNumber}
        </p>

        <p style={{ margin: "2px 0" }}>
          <strong>Due Date:</strong> {dueDate}
        </p>
      </div>
    </div>
  );
};


export default PartyInvoiceBlock;
