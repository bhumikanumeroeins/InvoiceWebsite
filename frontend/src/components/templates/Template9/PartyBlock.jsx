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
    <div style={{ width: 630, display: "flex", justifyContent: "space-between" }}>
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

      <div>
        {[
          ["Invoice#", invoiceNumber],
          ["Invoice Date", invoiceDate],
          ["P.O#", poNumber],
          ["Due Date", dueDate],
        ].map(([l, v]) => (
          <p key={l}>
            <strong>{l}: </strong>
            {v}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PartyBlock;
