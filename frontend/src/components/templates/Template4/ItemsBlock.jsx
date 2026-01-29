const ItemsBlock = ({ items }) => {
  const pink = "#be549f";
  const gray = "#374151";

  return (
    <div style={{ width: 700 }}>
      <div style={{ display: "flex", marginBottom: 10 }}>
        {["Qty", "Description", "Unit Price", "Amount"].map((h, i) => (
          <div
            key={h}
            style={{
              width: ["10%", "45%", "22%", "23%"][i],
              color: pink,
              fontWeight: 700,
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
            borderBottom: "1px solid #6b7280",
            padding: "18px 0",
          }}
        >
          <div style={{ width: "10%" }}>{item.quantity}</div>
          <div style={{ width: "45%" }}>{item.description}</div>
          <div style={{ width: "22%", textAlign: "center" }}>{item.rate}</div>
          <div style={{ width: "23%", textAlign: "right" }}>{item.amount}</div>
        </div>
      ))}
    </div>
  );
};

export default ItemsBlock;
