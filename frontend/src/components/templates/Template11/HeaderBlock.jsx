const HeaderBlock = ({ companyName, companyAddress }) => {
  return (
    <div style={{ width: 700, display: "flex", justifyContent: "space-between" }}>
      <div
          style={{
            maxWidth: 190,          
          }}
        >
          <h1 style={{ margin: 0 }}>LOGO</h1>

          <p
            style={{
              fontWeight: 700,
              marginTop: 10,
              lineHeight: 1.25,
              wordBreak: "break-word",
            }}
          >
            {companyName}
          </p>

          <p
            style={{
              whiteSpace: "pre-line",
              fontSize: 14,
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {companyAddress}
          </p>
        </div>


      <div style={{ fontSize: 56, letterSpacing: 6, fontWeight: 300 }}>
        INVOICE
      </div>
    </div>
  );
};

export default HeaderBlock;
