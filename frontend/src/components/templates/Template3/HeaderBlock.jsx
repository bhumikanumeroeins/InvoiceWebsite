const HeaderBlock = ({ companyName, companyAddress }) => {
  const navy = "#12498e";

  return (
    <div style={{ padding: "35px 50px 0" }}>
      <div style={{ marginLeft: 130 }}>
        <h1
          style={{
            color: navy,
            fontSize: 28,
            fontWeight: 700,
            margin: "0 0 2px",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          LOGO
        </h1>

        <p
          style={{
            color: navy,
            fontSize: 15,
            fontWeight: 800,
            margin: "0 0 2px",
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          {companyName}
        </p>

        <p
          style={{
            color: navy,
            fontSize: 14,
            margin: 0,
            whiteSpace: "pre-line",
            lineHeight: 1.4,
          }}
        >
          {companyAddress}
        </p>
      </div>
    </div>
  );
};

export default HeaderBlock;
