const teal = "#2bb6b1";

const ItemsBlock = ({ items }) => {
  return (
    <div style={{ width: 720 }}>
      <div
        style={{
          display: "flex",
          background: teal,
          color: "#fff",
          padding: 12,
          fontWeight: 600,
        }}
      >
        <div style={{ width: "10%" }}>Qty</div>
        <div style={{ width: "40%" }}>Description</div>
        <div style={{ width: "25%", textAlign: "center" }}>
          Unit Price
        </div>
        <div style={{ width: "25%", textAlign: "right" }}>
          Amount
        </div>
      </div>

      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", padding: 12 }}>
          <div style={{ width: "10%" }}>{item.quantity}</div>
          <div style={{ width: "40%" }}>{item.description}</div>
          <div style={{ width: "25%", textAlign: "center" }}>
            {item.rate}
          </div>
          <div style={{ width: "25%", textAlign: "right" }}>
            {item.amount}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsBlock;
