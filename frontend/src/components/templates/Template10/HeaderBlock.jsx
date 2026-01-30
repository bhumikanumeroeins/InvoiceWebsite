const HeaderBlock = ({ companyName, companyAddress }) => {
  return (
    <div style={{ width: 794 }}>
      {/* Grey header */}
      <div
        style={{
          background: "#8c8f92",
          color: "#fff",
          padding: "40px 80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>LOGO</p>
          <p style={{ fontWeight: 700, marginTop: 10 }}>{companyName}</p>
          <p style={{ whiteSpace: "pre-line", fontSize: 14 }}>
            {companyAddress}
          </p>
        </div>

        <div
          style={{
            fontSize: 70,
            letterSpacing: 4,
            fontWeight: 300,
          }}
        >
          INVOICE
        </div>
      </div>

      {/* Dark line */}
      <div style={{ height: 6, background: "#2f343a" }} />

      {/* Rainbow */}
      <div
        style={{
          height: 6,
          background:
            "linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)",
        }}
      />
    </div>
  );
};

export default HeaderBlock;
