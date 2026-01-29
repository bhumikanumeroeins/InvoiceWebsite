const TotalsBlock = ({ subtotal, taxAmount, total, terms }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "40px 50px 0",
        width: 700,
      }}
    >
      <div style={{ width: "45%" }}>
        <strong>TERMS</strong>
        {terms.map((t, i) => (
          <p key={i}>◆ {t}</p>
        ))}
      </div>

      <div style={{ width: "40%" }}>
        {[
          ["Subtotal", subtotal],
          ["Tax", taxAmount],
        ].map(([l, v]) => (
          <div
            key={l}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <strong>{l}</strong>
            <span>{v}</span>
          </div>
        ))}

        <div
          style={{
            background: "#ff0f7c",
            color: "#fff",
            marginTop: 10,
            padding: 12,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <strong>TOTAL</strong>
          <span>{total}</span>
        </div>
      </div>
    </div>
  );
};

export default TotalsBlock;
