const FooterBlock = ({ email, phone, website }) => {
  return (
    <div
      style={{
        width: 794,
        background: "#1f2552",
        color: "#fff",
        padding: "15px 0",
        display: "flex",
        justifyContent: "center",
        gap: 50,
        fontSize: 13,
      }}
    >
      <span>{email}</span>
      <span>{phone}</span>
      <span>{website}</span>
    </div>
  );
};

export default FooterBlock;
