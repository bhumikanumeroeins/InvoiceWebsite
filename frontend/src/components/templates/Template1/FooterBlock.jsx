const FooterBlock = ({ email, phone, website }) => {
  return (
    <div
      style={{
        background: "transparent",
        padding: "10px 50px",
        display: "flex",
        justifyContent: "space-between",
        width: 700,
        color: "#ffffff",
      }}
    >
      <div>
        <strong>EMAIL</strong>
        <p>{email}</p>
      </div>

      <div>
        <strong>PHONE</strong>
        <p>{phone}</p>
      </div>

      <div>
        <strong>WEBSITE</strong>
        <p>{website}</p>
      </div>
    </div>
  );
};

export default FooterBlock;
