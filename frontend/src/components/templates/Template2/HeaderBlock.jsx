const HeaderBlock = ({
  logo,
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        right: 48,
        textAlign: "right",
      }}
    >
      {logo && (
        <img
          src={logo}
          style={{
            height: 52,
            width: "auto",
            display: "block",
            objectFit: "contain",
            marginBottom: 6
          }}
        />
      )}

      <h1
        style={{
          color: "#fff",
          fontSize: 46,
          fontWeight: 700,
          letterSpacing: 1,
          margin: "0 0 8px 0",
        }}
      >
        INVOICE.
      </h1>

      <div
        style={{
          background: "#000",
          padding: "12px 16px",
          borderRadius: 2,
          minWidth: 210,
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
              justifyContent: "space-between",
              gap: 12,
              fontSize: 13,
              lineHeight: "18px",
            }}
          >
            <span style={{ color: "#fff", opacity: 0.9 }}>{l}</span>
            <span style={{ color: "#fff", fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default HeaderBlock;