const PartyBlock = ({
  billToName,
  billToAddress,
  shipToName,
  shipToAddress,
}) => {
  return (
    <div style={{ width: 200 }}>
      <b>Bill To</b>
      <p>{billToName}</p>
      <p style={{ whiteSpace: "pre-line" }}>{billToAddress}</p>

      <div style={{ marginTop: 68 }}>
        <b>Ship To</b>
        <p>{shipToName}</p>
        <p style={{ whiteSpace: "pre-line" }}>{shipToAddress}</p>
      </div>
    </div>
  );
};

export default PartyBlock;
