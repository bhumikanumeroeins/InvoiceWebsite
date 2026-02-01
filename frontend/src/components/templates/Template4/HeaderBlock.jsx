const HeaderBlock = ({ logo, companyName, companyAddress }) => {
  const gray = "#374151";

  return (
    <div style={{ width: 350, paddingLeft: 150 }}>
      {/* LOGO */}
      {logo ? (
        <img
          src={logo}
          alt="logo"
          style={{
            height: 42,
            width: "auto",
            display: "block",
            objectFit: "contain",
            marginBottom: 6,
          }}
        />
      ) : (
        <p
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: gray,
            margin: 0,
          }}
        >
          LOGO
        </p>
      )}

      {/* COMPANY */}
      <p style={{ fontWeight: 700, margin: "4px 0" }}>
        {companyName}
      </p>

      {/* ADDRESS */}
      <p
        style={{
          whiteSpace: "pre-line",
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {companyAddress}
      </p>
    </div>
  );
};

export default HeaderBlock;
