const HeaderBlock = ({
  logo,
  companyName,
  companyAddress,
  billToName,
  billToAddress,
  shipToName,
  shipToAddress,
}) => {
  const orange = "#fec62f";

  return (
    <div
      style={{
        width: 640,
        paddingTop: 25,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {/* LEFT — LOGO + COMPANY */}
        <div>
          {/* LOGO */}
          {logo ? (
            <img
              src={logo}
              alt="logo"
              style={{
                height: 42,
                width: "auto",
                display: "block",
                objectFit: "contain",
                marginBottom: 4,
              }}
            />
          ) : (
            <p
              style={{
                color: "#fff",
                fontSize: 22,
                margin: 0,
                fontWeight: 700,
              }}
            >
              LOGO
            </p>
          )}

          {/* COMPANY NAME */}
          <p
            style={{
              color: orange,
              fontSize: 22,
              fontWeight: 700,
              margin: "4px 0",
              maxWidth: 210,
              lineHeight: 1.25,
              wordBreak: "break-word",
            }}
          >
            {companyName}
          </p>

          {/* ADDRESS */}
          <p
            style={{
              whiteSpace: "pre-line",
              color: "#fff",
              fontSize: 13,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {companyAddress}
          </p>
        </div>

        {/* RIGHT — BILL / SHIP */}
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              color: "#fff",
              fontSize: 15,
              fontWeight: 800,
              margin: "0 0 4px",
            }}
          >
            Bill To
          </p>

          <p style={{ color: "#fff", fontSize: 13, margin: 0 }}>
            {billToName}
          </p>

          <p style={{ color: "#fff", fontSize: 12, margin: "0 0 10px" }}>
            {billToAddress}
          </p>

          <p
            style={{
              color: "#fff",
              fontSize: 15,
              fontWeight: 800,
              margin: "0 0 4px",
            }}
          >
            Ship To
          </p>

          <p style={{ color: "#fff", fontSize: 13, margin: 0 }}>
            {shipToName}
          </p>

          <p style={{ color: "#fff", fontSize: 12, margin: 0 }}>
            {shipToAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderBlock;
