const FooterBlock = ({ email, phone, website }) => {
  return (
    <div
      style={{
        width: 794,
        display: "flex",
        justifyContent: "center",
        gap: 40,
        color: "#fff",
        fontSize: 12,
      }}
    >
      <span>{email}</span>
      <span>{phone}</span>
      <span>{website}</span>
    </div>
  );
};

export default FooterBlock;
