const PartyTitleBlock = ({
  billToName,
  billToAddress,
  shipToName,
  shipToAddress,
}) => {
  return (
    <div style={{ width: 600, display: "flex", justifyContent: "space-between" }}>
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

      <h1
        style={{
          fontSize: 72,
          fontWeight: 900,
          letterSpacing: "-1px",
        }}
      >
        Invoice
      </h1>

    </div>
  );
};

export default PartyTitleBlock;
