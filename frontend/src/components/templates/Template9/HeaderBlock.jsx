const HeaderBlock = ({ companyName, companyAddress }) => {
  return (
    <div
      style={{
        width: 630,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {/* LEFT — LOGO */}
      <p
        style={{
          fontFamily: "Bebas Neue",
          fontSize: 32,
          margin: 0,
          letterSpacing: 1,
        }}
      >
        LOGO
      </p>

      {/* RIGHT — COMPANY */}
      <div
        style={{
          textAlign: "right",
          width: 200,           // 👈 forces two lines
          lineHeight: 1.35,
        }}
      >
        <p
          style={{
            fontWeight: 700,
            margin: 0,
            marginBottom: 4,
          }}
        >
          {companyName}
        </p>

        <p
          style={{
            margin: 0,
            fontSize: 14,
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          {companyAddress}
        </p>
      </div>
    </div>
  );
};

export default HeaderBlock;
