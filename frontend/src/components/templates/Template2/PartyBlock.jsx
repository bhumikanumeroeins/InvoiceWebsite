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
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {[ 
        ["Company", companyName, companyAddress],
        ["Bill To", billToName, billToAddress],
        ["Ship To", shipToName, shipToAddress],
      ].map(([title, name, addr]) => (
        <div key={title} style={{ width: "100%" }}>
          <p
            style={{
              fontWeight: 700,
              fontFamily: "'Fira Sans', sans-serif",
              letterSpacing: 0.3,
            }}
          >{title}</p>
          <p>{name}</p>
          <p style={{ whiteSpace: "pre-line" }}>{addr}</p>
        </div>
      ))}
    </div>
  );
};

export default PartyBlock;
