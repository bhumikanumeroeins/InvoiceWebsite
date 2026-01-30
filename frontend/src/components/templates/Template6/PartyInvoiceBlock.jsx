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
    <div style={{ width: 694, display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
      <div>
        <strong>Bill To</strong>
        <p>{billToName}</p>
        <p>{billToAddress}</p>
      </div>

      <div>
        <strong>Ship To</strong>
        <p>{shipToName}</p>
        <p>{shipToAddress}</p>
      </div>

      <div style={{ textAlign: "right" }}>
        <h2>INVOICE</h2>
        <p>Invoice#: {invoiceNumber}</p>
        <p>Date: {invoiceDate}</p>
        <p>P.O#: {poNumber}</p>
        <p>Due: {dueDate}</p>
      </div>
    </div>
  );
};

export default PartyInvoiceBlock;
