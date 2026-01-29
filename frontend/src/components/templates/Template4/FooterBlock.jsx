const FooterBlock = ({ email, phone, website }) => {
  return (
    <div style={{ width: 700, display: "flex", gap: 15 }}>
      <span>{email}</span>
      <span>|</span>
      <span>{phone}</span>
      <span>|</span>
      <span>{website}</span>
    </div>
  );
};

export default FooterBlock;
