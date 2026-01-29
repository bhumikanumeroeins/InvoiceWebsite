const HeaderBlock = ({ companyName, companyAddress }) => {
  const gray = "#374151";

  return (
    <div style={{ width: 350, paddingLeft: 150 }}>
      <p style={{ fontSize: 30, fontWeight: 700, color: gray }}>LOGO</p>
      <p style={{ fontWeight: 700 }}>{companyName}</p>
      <p style={{ whiteSpace: "pre-line" }}>{companyAddress}</p>
    </div>
  );
};

export default HeaderBlock;
