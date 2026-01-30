const teal = "#2bb6b1";

const TermsTotalsBlock = ({
  terms,
  subtotal,
  taxAmount,
  total,
}) => {
  return (
    <div style={{ display: "flex", gap: 80 }}>
      <div>
        <b>Terms & Conditions</b>
        {terms.map((t, i) => (
          <p key={i}>■ {t}</p>
        ))}
      </div>

      <div style={{ width: 260 }}>
        {[
          ["Subtotal", subtotal],
          ["Tax", taxAmount],
        ].map(([l, v]) => (
          <div
            key={l}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span style={{ minWidth: 90 }}>{l}</span>
            <div
              style={{
                flex: 1,
                height: 2,
                background: teal,
                margin: "0 10px",
              }}
            />
            <span>{v}</span>
          </div>
        ))}

        <div
          style={{
            background: teal,
            color: "#fff",
            padding: "12px 14px",
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
          }}
        >
          <span>Total</span>
          <span>{total}</span>
        </div>
      </div>
    </div>
  );
};

export default TermsTotalsBlock;
