const FooterBlock = ({ email, phone, website }) => {
  return (
    <div
      style={{
        width: 500,
        display: "flex",
        justifyContent: "space-between",
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
