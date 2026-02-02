const TermsTotalsBlock = ({ terms, subtotal, taxAmount, total }) => {
  return (
    <div
      style={{
        width: 595,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {/* LEFT — TERMS */}
      <div>
        <p
          style={{
            fontWeight: 800,
            fontSize: 16,
            marginBottom: 6,
          }}
        >
          Terms & Conditions
        </p>

        {terms.map((t, i) => (
          <p
            key={i}
            style={{
              margin: "3px 0",
              fontSize: 13,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 10 }}>■</span>
            {t}
          </p>
        ))}
      </div>

      {/* RIGHT — TOTALS */}
      <div style={{ minWidth: 220 }}>
        {[
          ["Sub Total:", subtotal, false],
          ["Tax:", taxAmount, false],
          ["Total:", total, true],
        ].map(([l, v, isTotal]) => (
          <div
            key={l}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: isTotal ? 6 : 4,
              paddingTop: isTotal ? 6 : 0,
              borderTop: isTotal ? "2px solid #333" : "none",
            }}
          >
            <span
              style={{
                fontWeight: isTotal ? 800 : 600,
                fontSize: isTotal ? 15 : 14,
              }}
            >
              {l}
            </span>

            <span
              style={{
                fontWeight: isTotal ? 800 : 600,
                fontSize: isTotal ? 15 : 14,
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
