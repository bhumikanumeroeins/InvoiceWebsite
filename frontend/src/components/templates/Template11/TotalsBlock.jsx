const TotalsBlock = ({ subtotal, taxAmount, total }) => {
  const dark = "#24364f";

  return (
    <div style={{ width: 260 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Sub Total</span>
        <span>{subtotal.toLocaleString("en-IN")}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Tax</span>
        <span>{taxAmount.toLocaleString("en-IN")}</span>
      </div>

      <div
        style={{
          marginTop: 10,
          background: dark,
          color: "#fff",
          padding: 12,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <b>Total</b>
        <b>{total.toLocaleString("en-IN")}</b>
      </div>
    </div>
  );
};

export default TotalsBlock;
