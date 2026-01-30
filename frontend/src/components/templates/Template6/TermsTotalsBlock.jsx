const TermsTotalsBlock = ({
  terms,
  subtotal,
  taxAmount,
  total,
}) => {
  return (
    <div style={{ width: 680, display: "flex", justifyContent: "space-between" }}>
      <div style={{ width: "50%" }}>
        <p style={{ fontWeight: 700 }}>Terms and Conditions</p>
        {terms.map((t, i) => (
          <p key={i}>▪ {t}</p>
        ))}
      </div>

      <div style={{ width: "35%" }}>
        {[
          ["Sub Total", subtotal],
          ["Tax", taxAmount],
          ["Total", total],
        ].map(([l, v]) => (
          <div
            key={l}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>{l}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsTotalsBlock;
