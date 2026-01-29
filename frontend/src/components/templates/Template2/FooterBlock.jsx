const FooterBlock = ({ email, website, phone }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "15px 50px",
      }}
    >
      <p style={{ textAlign: "center", fontWeight: 700 }}>
        Thank for your business!
      </p>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{email}</span>
        <span>{website}</span>
        <span>{phone}</span>
      </div>
    </div>
  );
};

export default FooterBlock;
