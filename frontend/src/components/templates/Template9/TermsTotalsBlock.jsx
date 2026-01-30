const TermsTotalsBlock = ({ terms, subtotal, taxAmount, total }) => {
  return (
    <div style={{ width: 630, display: "flex", justifyContent: "space-between" }}>
      <div>
        <p style={{ fontFamily: "Bebas Neue", fontSize: 20 }}>
          Terms and Conditions
        </p>
        {terms.map((t, i) => (
          <p key={i}>◆ {t}</p>
        ))}
      </div>

      <div>
        {[
          ["Subtotal", subtotal],
          ["Tax", taxAmount],
          ["Total", total],
        ].map(([l, v]) => (
          <div key={l}>
            <strong>{l}: </strong>
            {v}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsTotalsBlock;
