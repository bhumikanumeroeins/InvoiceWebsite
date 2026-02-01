const PartyBlock = ({
  billToName,
  billToAddress,
  shipToName,
  shipToAddress,
}) => {
  const navy = "#12498e";

  return (
    <div
      style={{
        padding: "50px 50px 0",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ width: "45%" }}>
        <p style={{ color: navy, fontWeight: 800, fontFamily: "'Orbitron', sans-serif", }}>INVOICE TO</p>
        <p style={{ color: navy }}>
          {billToName}
          <br />
          {billToAddress.replace("\n", " ")}
        </p>
      </div>

      <div style={{ width: "45%" }}>
        <p style={{ color: navy, fontWeight: 800, fontFamily: "'Orbitron', sans-serif", }}>Ship To</p>
        <p style={{ color: navy }}>
          {shipToName}
          <br />
          {shipToAddress.replace("\n", " ")}
        </p>
      </div>
    </div>
  );
};

export default PartyBlock;
