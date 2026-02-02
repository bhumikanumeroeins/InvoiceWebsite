const PartyBlock = ({
  billToName,
  billToAddress,
  shipToName,
  shipToAddress,
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  const navy = "#1f2a5a";

  return (
    <div
      style={{
        width: 630,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 20,
        marginTop: 12,
      }}
    >
      {/* BILL TO */}
      <div>
        <p
          style={{
            fontWeight: 700,
            fontSize: 16,
            margin: "0 0 4px",
            color: navy,
          }}
        >
          Bill To
        </p>

        <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>{billToName}</p>

        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "#4b5563",
            lineHeight: 1.4,
          }}
        >
          {billToAddress}
        </p>
      </div>

      {/* SHIP TO */}
      <div>
        <p
          style={{
            fontWeight: 700,
            fontSize: 14,
            margin: "0 0 4px",
            color: navy,
          }}
        >
          Ship To
        </p>

        <p style={{ margin: 0, fontWeight: 600 }}>{shipToName}</p>

        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "#4b5563",
            lineHeight: 1.4,
          }}
        >
          {shipToAddress}
        </p>
      </div>

      {/* INVOICE META */}
      <div style={{ fontSize: 13 }}>
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
              alignItems: "flex-start",
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: navy,
                width: 110,          
                flexShrink: 0,
              }}
            >
              {l}:
            </span>

            <span>{v}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default PartyBlock;
