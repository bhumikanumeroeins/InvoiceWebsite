const TermsTotalsBlock = ({ terms, subtotal, taxAmount, total }) => {
  return (
    <div
      style={{
        width: 630,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {/* TERMS */}
      <div>
        <p style={{ fontWeight: 700 }}>Terms and Conditions</p>

        {terms.map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                transform: "rotate(45deg)",
                background:
                  "linear-gradient(135deg, red, orange, yellow, green, cyan, blue, violet)",
                display: "inline-block",
              }}
            />
            <span>{t}</span>
          </div>
        ))}
      </div>

      {/* TOTALS */}
      <div style={{ minWidth: 240 }}>
        <div>
          <strong>SUBTOTAL:</strong> {subtotal}
        </div>
        <div>
          <strong>TAX:</strong> {taxAmount}
        </div>

        {/* grey bar */}
        <div style={{ height: 8, background: "#9ca3af", margin: "10px 0" }} />

        {/* total */}
        <div
          style={{
            background: "#2f343a",
            color: "#fff",
            padding: 12,
            fontWeight: 700,
          }}
        >
          TOTAL: {total}
        </div>

        {/* rainbow */}
        <div
          style={{
            height: 4,
            background:
              "linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)",
          }}
        />
      </div>
    </div>
  );
};

export default TermsTotalsBlock;
