const HeaderBlock = ({logo}) => {
  return (
    <div
      style={{
        textAlign: "center",
        width: 720,
      }}
    >
      {logo ? (
          <img
            src={logo}
            alt="logo"
            style={{
              height: 40,
              width: "auto",
              display: "block",
              margin: "0 auto",
              objectFit: "contain",
            }}
          />
        ) : (
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            LOGO
          </div>
        )}

    </div>
  );
};

export default HeaderBlock;
