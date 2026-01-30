const HeaderBlock = ({ companyName, companyAddress }) => {
  return (
    <div style={{ width: 630, display: "flex", justifyContent: "space-between" }}>
      <p style={{ fontFamily: "Bebas Neue", fontSize: 32 }}>LOGO</p>

      <div style={{ textAlign: "right" }}>
        <p style={{ fontWeight: 700 }}>{companyName}</p>
        <p style={{ whiteSpace: "pre-line" }}>{companyAddress}</p>
      </div>
    </div>
  );
};

export default HeaderBlock;
