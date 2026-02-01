const TermsTotalsBlock = ({
  terms,
  subtotal,
  taxAmount,
  total,
}) => {
  const purple = "#4a415d";

  return (
    <div
      style={{
        width: 630,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {/* LEFT — TERMS */}
      <div>
        <p
          style={{
            fontWeight: 800,
            fontSize: 16,
            color: purple,
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
              color: purple,
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 10 }}>•</span>
            {t}
          </p>
        ))}
      </div>

      {/* RIGHT — TOTALS */}
      <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px auto",
            rowGap: 6,
          }}
        >
          {[
            ["Sub total", subtotal, false],
            ["Tax", taxAmount, false],
            ["Total", total, true],
          ].map(([l, v, isTotal]) => (
            <div
              key={l}
              style={{
                display: "contents",
              }}
            >
              <span
                style={{
                  fontWeight: isTotal ? 800 : 600,
                  fontSize: isTotal ? 15 : 14,
                  color: "#4a415d",
                  borderTop: isTotal ? "2px solid #bbb" : "none",
                  paddingTop: isTotal ? 6 : 0,
                }}
              >
                {l}:
              </span>

              <span
                style={{
                  fontWeight: isTotal ? 800 : 700,
                  fontSize: isTotal ? 15 : 14,
                  color: "#4a415d",
                  borderTop: isTotal ? "2px solid #bbb" : "none",
                  paddingTop: isTotal ? 6 : 0,
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
