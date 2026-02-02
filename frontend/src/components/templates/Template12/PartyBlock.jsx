const PartyBlock = ({
  companyName,
  companyAddress,
  billToName,
  billToAddress,
  shipToName,
  shipToAddress,
}) => {
  return (
    <div
      style={{
        width: 720,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {/* COMPANY */}
      <div style={{ maxWidth: 220 }}>
        <b>{companyName}</b>

        <p
          style={{
            whiteSpace: "pre-line",
            lineHeight: "1.5",
          }}
        >
          {companyAddress}
        </p>
      </div>

      {/* BILL TO */}
      <div style={{ maxWidth: 220 }}>
        <b>Bill To</b>

        <p style={{ fontWeight: 600 }}>{billToName}</p>

        <p
          style={{
            whiteSpace: "pre-line",
            lineHeight: "1.5",
          }}
        >
          {billToAddress}
        </p>
      </div>

      {/* SHIP TO */}
      <div style={{ maxWidth: 220 }}>
        <b>Ship To</b>

        <p style={{ fontWeight: 600 }}>{shipToName}</p>

        <p
          style={{
            whiteSpace: "pre-line",
            lineHeight: "1.5",
          }}
        >
          {shipToAddress}
        </p>
      </div>
    </div>
  );
};

export default PartyBlock;
