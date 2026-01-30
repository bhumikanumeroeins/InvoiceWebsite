const HeaderBlock = ({ logo, companyName, companyAddress }) => {
  return (
    <div style={{ width: 794, padding: "40px 50px", color: "#fff" }}>
      {logo ? (
        <img src={logo} style={{ height: 70 }} />
      ) : (
        <p style={{ fontSize: 38, fontWeight: 700 }}>LOGO</p>
      )}

      <p style={{ marginTop: 18, fontSize: 14 }}>{companyName}</p>
      <p style={{ fontSize: 18 }}>{companyAddress}</p>
    </div>
  );
};

export default HeaderBlock;
