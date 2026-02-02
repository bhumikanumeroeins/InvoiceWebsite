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
        <p style={{ color: pink, fontWeight: 700 }}>Bill To</p>
        <p>{billToName}</p>
        <p>{billToAddress}</p>
      </div>

      <div style={{ width: "28%" }}>
        <p style={{ color: pink, fontWeight: 700 }}>Ship To</p>
        <p>{shipToName}</p>
        <p>{shipToAddress}</p>
      </div>

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
              padding: isTotal ? "12px 0 0" : "6px 0",
              marginTop: isTotal ? 8 : 0,
              borderTop: isTotal ? "2px solid #333" : "none",
            }}
          >
            <span
              style={{
                fontWeight: isTotal ? 800 : 600,
                fontSize: isTotal ? 18 : 15,
              }}
            >
              {l}:
            </span>

            <span
              style={{
                fontWeight: isTotal ? 800 : 600,
                fontSize: isTotal ? 18 : 15,
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

export default PartyTotalsBlock;
