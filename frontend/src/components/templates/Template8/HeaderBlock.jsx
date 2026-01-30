const HeaderBlock = ({
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
        width: 630,
        display: "flex",
        justifyContent: "space-between",
        color: "#fff",
      }}
    >
      <div>
        <p style={{ fontSize: 24, margin: 0 }}>LOGO</p>
        <p style={{ fontWeight: 700 }}>{companyName}</p>
        <p style={{ whiteSpace: "pre-line" }}>{companyAddress}</p>
      </div>

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
    </div>
  );
};

export default HeaderBlock;
