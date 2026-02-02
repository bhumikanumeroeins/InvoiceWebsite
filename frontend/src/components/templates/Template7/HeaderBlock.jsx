const HeaderBlock = ({
  logo,
  companyName,
  companyAddress,
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  return (
    <div
      style={{
        width: 600,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {/* LEFT */}
      <div>
        {/* LOGO */}
        {logo ? (
          <img
            src={logo}
            alt="logo"
            style={{
              height: 46,
              width: "auto",
              objectFit: "contain",
              display: "block",
              marginBottom: 4,
            }}
          />
        ) : (
          <p
            style={{
              fontWeight: 800,
              fontSize: 26,
              margin: 0,
            }}
          >
            LOGO
          </p>
        )}

        {/* COMPANY NAME */}
        <p
          style={{
            fontSize: 22,
            fontWeight: 700,
            margin: "4px 0",
          }}
        >
          {companyName}
        </p>

        {/* ADDRESS */}
        <p
          style={{
            maxWidth: 190,
            lineHeight: 1.45,
            fontSize: 14,
            margin: 0,
            wordBreak: "break-word",
            whiteSpace: "pre-line",
          }}
        >
          {companyAddress}
        </p>
      </div>

      {/* RIGHT — INVOICE META */}
      <div
        style={{
          fontSize: 13,
          lineHeight: 1.6,
          textAlign: "left",
          minWidth: 200,
        }}
      >
        {[
          ["Invoice#", invoiceNumber],
          ["Invoice Date", invoiceDate],
          ["P.O#", poNumber],
          ["Due Date", dueDate],
        ].map(([l, v]) => (
          <div
            key={l}
            style={{
              display: "grid",
              gridTemplateColumns: "110px 1fr", // 👈 locks alignment
              marginBottom: 3,
            }}
          >
            <span style={{ fontWeight: 600 }}>{l}:</span>
            <span style={{ fontWeight: 700 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderBlock;
