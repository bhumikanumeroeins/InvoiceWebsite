const ItemsBlock = ({ items }) => {
  return (
    <div style={{ width: 630 }}>
      <div
        style={{
          display: "flex",
          fontWeight: 700,
          padding: "12px 20px",
          background: "#fdeccd",
          borderRadius: 30,
        }}
      >
        {["Qty", "Description", "Unit Price", "Amount"].map((h, i) => (
          <div
            key={h}
            style={{ width: ["10%", "45%", "20%", "25%"][i] }}
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
            padding: "12px 20px",
            marginTop: 6,
            background: i % 2 ? "#fdeccd" : "transparent",
            borderRadius: 30,
          }}
        >
          <div style={{ width: "10%" }}>{item.quantity}</div>
          <div style={{ width: "45%" }}>{item.description}</div>
          <div style={{ width: "20%", textAlign: "center" }}>{item.rate}</div>
          <div style={{ width: "25%", textAlign: "right" }}>{item.amount}</div>
        </div>
      ))}
    </div>
  );
};

export default ItemsBlock;
