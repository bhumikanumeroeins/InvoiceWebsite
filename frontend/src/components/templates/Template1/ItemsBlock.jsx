const ItemsBlock = ({ items }) => {
  return (
    <div style={{ padding: "0 50px", width: 700 }}>
      <div
        style={{
          background: "#ff0f7c",
          display: "flex",
          padding: "12px 35px",
          color: "#fff",
          fontWeight: 700,
        }}
      >
        {["QTY", "DESC", "RATE", "AMOUNT"].map((h, i) => (
          <div key={h} style={{ width: ["12%", "38%", "25%", "25%"][i] }}>
            {h}
          </div>
        ))}
      </div>

      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            padding: "14px 35px",
            borderBottom: "1px solid #eee",
          }}
        >
          <div style={{ width: "12%" }}>{item.quantity}</div>
          <div style={{ width: "38%" }}>{item.description}</div>
          <div style={{ width: "25%" }}>{item.rate}</div>
          <div style={{ width: "25%", textAlign: "right" }}>
            {item.amount}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsBlock;
