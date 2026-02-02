const ItemsBlock = ({ items }) => {
  return (
    <div style={{ width: 630 }}>
      {/* Dark top */}
      <div style={{ height: 5, background: "#8c8f92" }} />

      {/* Header row */}
      <div
        style={{
          display: "flex",
          background: "#2f343a",
          color: "#fff",
          padding: 12,
        }}
      >
        {["Qty", "Description", "Unit Price", "Amount"].map((h, i) => (
          <div
            key={h}
            style={{
              width: ["10%", "45%", "20%", "25%"][i],
              textAlign:
                i === 0 || i === 2 ? "center" : i === 3 ? "right" : "left",
              fontWeight: 600,
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Rainbow */}
      <div
        style={{
          height: 4,
          background:
            "linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)",
        }}
      />

      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            borderBottom: "1px solid #ccc",
          }}
        >
          <div
            style={{
              width: "10%",
              background: "#f3f3f3",
              padding: 14,
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            {item.quantity}
          </div>

          <div style={{ width: "45%", padding: 14 }}>
            {item.description}
          </div>

          <div
            style={{
              width: "20%",
              background: "#f3f3f3",
              padding: 14,
              textAlign: "center",
            }}
          >
            {item.rate}
          </div>

          <div
            style={{
              width: "25%",
              padding: 14,
              textAlign: "right",
            }}
          >
            {item.amount}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsBlock;
