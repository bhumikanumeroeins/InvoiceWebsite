const ItemsBlock = ({ items }) => {
  return (
    <div style={{ width: 714 }}>
      <div
        style={{
          display: "flex",
          background: "#ffc21c",
          padding: "12px 12px 12px 50px",
          fontWeight: 700,
        }}
      >
       {["Qty", "Description", "Unit Price", "Amount"].map((h, i) => (
        <div
          key={h}
          style={{
            width: ["10%", "45%", "20%", "25%"][i],
            textAlign:
              i === 0 || i === 2 ? "center" : i === 3 ? "right" : "left",

            fontFamily: "'Bebas Neue', sans-serif",
            textTransform: "uppercase",
            letterSpacing: 1,
            fontSize: 16,
            color: "#1f2a5a",
          }}
        >
          {h}
        </div>
      ))}
      </div>

      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            padding: "14px 14px 14px 50px",
            borderBottom: "1px solid #d1d5db",
          }}
        >
          <div style={{ width: "10%", textAlign: "center" }}>
            {item.quantity}
          </div>
          <div style={{ width: "45%" }}>{item.description}</div>
          <div style={{ width: "20%", textAlign: "center" }}>
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
