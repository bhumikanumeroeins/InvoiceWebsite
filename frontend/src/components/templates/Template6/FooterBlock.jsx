const FooterBlock = ({ phone, email, website }) => {
  return (
    <div
      style={{
        width: 794,
        padding: "0 50px",
        display: "flex",
        justifyContent: "space-between",
        color: "#fff",
        fontSize: 12,
        alignItems: "center",
      }}
    >
      <span>{phone}</span>
      <span>{email}</span>
      <span>{website}</span>
    </div>
  );
};

export default FooterBlock;
