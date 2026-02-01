const HeaderBlock = ({
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
        <p
          style={{
            fontWeight: 800,
            fontSize: 26,
            margin: 0,
          }}
        >
          LOGO
        </p>

        <p
          style={{
            fontSize: 22,
            fontWeight: 700,
            margin: "4px 0",
          }}
        >
          {companyName}
        </p>

        <p
          style={{
            maxWidth: 190,          // 👈 forces wrap
            lineHeight: 1.45,
            fontSize: 14,
            margin: 0,
            wordBreak: "break-word",
          }}
        >
          {companyAddress}
        </p>
      </div>

      {/* RIGHT — INVOICE META */}
      <div
        style={{
          fontSize: 13,
          lineHeight: 1.55,
          textAlign: "left",
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
              display: "flex",
              gap: 6,
              marginBottom: 2,
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
