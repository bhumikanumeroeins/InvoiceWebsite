const HeaderBlock = ({ logo, companyName, companyAddress }) => {
  const navy = "#12498e";

  return (
    <div style={{ padding: "35px 50px 0" }}>
      <div
          style={{
            marginLeft: 130,
            maxWidth: 260,   
          }}
        >
        {logo ? (
          <img
            src={logo}
            alt="logo"
            style={{
              height: 46,
              width: "auto",
              display: "block",
              objectFit: "contain",
              marginBottom: 4,
            }}
          />
        ) : (
          <h1
            style={{
              color: navy,
              fontSize: 28,
              fontWeight: 700,
              margin: "0 0 2px",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            LOGO
          </h1>
        )}

        <p
          style={{
            color: navy,
            fontSize: 15,
            fontWeight: 600,
            margin: "0 0 2px",
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.25,
            wordBreak: "break-word",
          }}
        >
          {companyName}
        </p>

        <p
          style={{
            color: navy,
            fontSize: 14,
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "pre-line",
            lineHeight: 1.4,
          }}
        >
          {companyAddress}
        </p>
      </div>
    </div>
  );
};

export default HeaderBlock;
