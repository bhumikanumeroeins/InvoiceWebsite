const TermsTotalsBlock = ({ terms, subtotal, taxAmount, total }) => {
  const navy = "#1f2a5a";

  return (
    <div
      style={{
        width: 630,
        display: "flex",
        justifyContent: "space-between",
        marginTop: 18,
      }}
    >
      {/* LEFT — TERMS */}
      <div>
        <p
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 18,
            letterSpacing: 1,
            color: navy,
            margin: "0 0 8px",
          }}
        >
          TERMS AND CONDITIONS
        </p>

        {terms.map((t, i) => (
          <p
            key={i}
            style={{
              margin: "4px 0",
              fontSize: 13,
              color: navy,
              display: "flex",
              gap: 8,
            }}
          >
            <span>◆</span>
            {t}
          </p>
        ))}
      </div>

      {/* RIGHT — TOTALS */}
      <div>
        {[
          ["SUBTOTAL", subtotal],
          ["TAX", taxAmount],
          ["TOTAL", total],
        ].map(([l, v]) => (
          <div
            key={l}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 30,
              marginBottom: 6,
              minWidth: 200,
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 16,
                color: navy,
                letterSpacing: 0.8,
              }}
            >
              {l}
            </span>

            <span
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: navy,
              }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsTotalsBlock;
