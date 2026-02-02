const TermsTotalsBlock = ({
  terms,
  subtotal,
  taxAmount,
  total,
}) => {
  return (
    <div
      style={{
        width: 680,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {/* TERMS */}
      <div style={{ width: "50%" }}>
        <p
          style={{
            fontWeight: 800,
            fontSize: 17,   // 👈 bigger
            marginBottom: 8,
          }}
        >
          Terms and Conditions
        </p>

        {terms.map((t, i) => (
          <p
            key={i}
            style={{
              margin: "3px 0",
              fontSize: 16,  
              fontWeight: 400,
            }}
          >
            ▪ {t}
          </p>
        ))}
      </div>

      {/* TOTALS */}
      <div style={{ width: "35%" }}>
        {[
          ["Sub Total", subtotal, false],
          ["Tax", taxAmount, false],
          ["Total", total, true],
        ].map(([l, v, isTotal]) => (
          <div
            key={l}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: isTotal ? "10px 0 0" : "6px 0",
              marginTop: isTotal ? 8 : 0,
              borderTop: isTotal ? "2px solid #333" : "none",
            }}
          >
            <span
              style={{
                fontWeight: isTotal ? 800 : 600,
                fontSize: isTotal ? 18 : 16, 
              }}
            >
              {l}
            </span>

            <span
              style={{
                fontWeight: isTotal ? 800 : 600,
                fontSize: isTotal ? 18 : 16, 
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
