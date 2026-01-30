const HeaderBlock = ({ companyName, companyAddress }) => {
  return (
    <div style={{ width: 600, display: "flex", justifyContent: "space-between" }}>
      <div>
        <h1 style={{ margin: 0 }}>LOGO</h1>
        <p style={{ fontWeight: 700, marginTop: 10 }}>{companyName}</p>
        <p style={{ whiteSpace: "pre-line", fontSize: 14 }}>
          {companyAddress}
        </p>
      </div>

      <div style={{ fontSize: 56, letterSpacing: 6, fontWeight: 300 }}>
        INVOICE
      </div>
    </div>
  );
};

export default HeaderBlock;
