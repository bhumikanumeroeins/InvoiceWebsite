const TermsTotalsBlock = ({ terms, subtotal, taxAmount, total }) => {
  return (
    <div style={{ width: 650, display: "flex", justifyContent: "space-between" }}>
      <div>
        <strong>Terms</strong>
        {terms.map((t, i) => (
          <p key={i}>■ {t}</p>
        ))}
      </div>

      <div>
        {[
          ["Sub Total", subtotal],
          ["Tax", taxAmount],
          ["Total", total],
        ].map(([l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{l}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsTotalsBlock;
