const TermsTotalsBlock = ({ terms, subtotal, taxAmount, total }) => {
  return (
    <div
      style={{
        width: 630,
        display: "flex",
        justifyContent: "space-between",
        marginTop: 20,
      }}
    >
      {/* TERMS */}
      <div>
        <p
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: "#374151",
            marginBottom: 10,
          }}
        >
          Terms and Conditions
        </p>

        {terms.map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
              fontSize: 13,
              color: "#374151",
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                transform: "rotate(45deg)",
                background:
                  "linear-gradient(135deg,#ff004c,#ff9500,#ffd400,#00d084,#00c2ff,#6a5cff,#b400ff)",
                display: "inline-block",
              }}
            />
            {t}
          </div>
        ))}
      </div>

      {/* TOTALS */}
      <div style={{ minWidth: 250 }}>
        {/* Sub + Tax */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          <strong>SUBTOTAL:</strong>
          <span>{subtotal}</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
          }}
        >
          <strong>TAX:</strong>
          <span>{taxAmount}</span>
        </div>

        {/* Grey bar */}
        <div
          style={{
            height: 10,
            background: "#9ca3af",
            margin: "12px 0",
          }}
        />

        {/* TOTAL BAR */}
        <div
          style={{
            background: "#2f343a",
            color: "#fff",
            padding: "12px 14px",
            fontWeight: 700,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 15,
          }}
        >
          <span>TOTAL:</span>
          <span>{total}</span>
        </div>

        {/* Rainbow strip */}
        <div
          style={{
            height: 4,
            background:
              "linear-gradient(to right,#ff004c,#ff9500,#ffd400,#00d084,#00c2ff,#6a5cff,#b400ff)",
          }}
        />
      </div>
    </div>
  );
};

export default TermsTotalsBlock;
