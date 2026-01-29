const PartyTotalsBlock = ({
  billToName,
  billToAddress,
  shipToName,
  shipToAddress,
  subtotal,
  taxAmount,
  total,
}) => {
  const pink = "#be549f";
  const gray = "#374151";

  return (
    <div style={{ width: 700, display: "flex", justifyContent: "space-between" }}>
      <div style={{ width: "28%" }}>
        <p style={{ color: pink }}>Bill To</p>
        <p>{billToName}</p>
        <p>{billToAddress}</p>
      </div>

      <div style={{ width: "28%" }}>
        <p style={{ color: pink }}>Ship To</p>
        <p>{shipToName}</p>
        <p>{shipToAddress}</p>
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

export default PartyTotalsBlock;
