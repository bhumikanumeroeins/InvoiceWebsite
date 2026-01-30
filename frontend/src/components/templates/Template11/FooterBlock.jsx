const FooterBlock = ({ email, phone, website }) => {
  return (
    <div
      style={{
        width: 835,
        background: "#24364f",
        color: "#fff",
        padding: 16,
        display: "flex",
        justifyContent: "center",
        gap: 50,
      }}
    >
      <span>{email}</span>
      <span>{phone}</span>
      <span>{website}</span>
    </div>
  );
};

export default FooterBlock;
