const PartyBlock = ({
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
        width: 630,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
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

      <div style={{ lineHeight: 1.8 }}>
        <div>
          <strong>Invoice#:</strong> {invoiceNumber}
        </div>
        <div>
          <strong>Invoice Date:</strong> {invoiceDate}
        </div>
        <div>
          <strong>P.O#:</strong> {poNumber}
        </div>
        <div>
          <strong>Due Date:</strong> {dueDate}
        </div>
      </div>
    </div>
  );
};

export default PartyBlock;
