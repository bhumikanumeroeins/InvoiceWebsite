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
        <p
          style={{
            whiteSpace: "pre-line",
            maxWidth: 220,     
            fontWeight: 700,     
            marginLeft: "auto",    
            lineHeight: 1.4,
            wordBreak: "break-word",
          }}
        >
          {companyAddress}
        </p>
        <p
          style={{
            whiteSpace: "pre-line",
            maxWidth: 220,     
            fontWeight: 700,     
            marginLeft: "auto",    
            lineHeight: 1.4,
            wordBreak: "break-word",
          }}
        >{companyAddress}</p>
      </div>

      <div style={{ fontFamily: "'Cabin', sans-serif" }}>
        <strong>Bill To</strong>
        <p>{billToName}</p>
        <p>{billToAddress}</p>
      </div>

      <div style={{ fontFamily: "'Cabin', sans-serif" }}>
        <strong>Ship To</strong>
        <p>{shipToName}</p>
        <p>{shipToAddress}</p>
      </div>
    </div>
  );
};

export default HeaderBlock;
