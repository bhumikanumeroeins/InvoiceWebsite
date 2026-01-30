const ItemsBlock = ({ items }) => {
  const dark = "#24364f";

  return (
    <div style={{ width: 610 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{ display: "flex", borderBottom: "1px solid #ddd" }}
        >
          <div
            style={{
              width: "12%",
              background: dark,
              color: "#fff",
              padding: 14,
            }}
          >
            {item.quantity}
          </div>

          <div style={{ width: "38%", padding: 14 }}>
            {item.description}
          </div>

          <div style={{ width: "25%", padding: 14, textAlign: "center" }}>
            {item.rate.toLocaleString("en-IN")}
          </div>

          <div style={{ width: "25%", padding: 14, textAlign: "right" }}>
            {item.amount.toLocaleString("en-IN")}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsBlock;
