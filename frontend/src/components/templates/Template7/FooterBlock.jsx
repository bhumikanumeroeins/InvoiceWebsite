const FooterBlock = ({ email, phone, website }) => {
  return (
    <div
      style={{
        width: 600,
        margin: "0 auto",
        textAlign: "center",
        fontSize: 12,
        display: "flex",
        justifyContent: "center",
        gap: 6,
      }}
    >
      <span>{email},</span>
      <span>{phone},</span>
      <span>{website}</span>
    </div>
  );
};

export default FooterBlock;
