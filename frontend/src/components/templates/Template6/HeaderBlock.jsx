const HeaderBlock = ({ logo, companyName, companyAddress }) => {
  return (
    <div style={{ width: 794, padding: "40px 50px", color: "#fff" }}>
      {logo ? (
        <img src={logo} style={{ height: 78 }} />
      ) : (
        <p style={{ fontSize: 44, fontWeight: 800, margin: 0 }}>LOGO</p>
      )}

      {/* Company Name */}
      <p
        style={{
          marginTop: 12,
          fontSize: 18,
          fontWeight: 700,
          maxWidth: 220,
        }}
      >
        {companyName}
      </p>

      {/* Address */}
      <p
        style={{
          fontSize: 14,
          maxWidth: 160,          
          lineHeight: 1.45,
          wordBreak: "break-word",
          whiteSpace: "normal",
          marginTop: 2,
        }}
      >
        {companyAddress}
      </p>

    </div>
  );
};

export default HeaderBlock;
