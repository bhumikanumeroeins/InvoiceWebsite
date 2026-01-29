const FooterBlock = ({ website, email, phone }) => {
  const coral = "#ff6b6b";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span style={{ color: coral }}>{website}</span>
      <span style={{ color: coral }}>
        {email}, {phone}
      </span>
    </div>
  );
};

export default FooterBlock;
