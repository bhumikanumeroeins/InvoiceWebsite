const ItemsBlock = ({ items }) => {
  const navy = "#12498e";

  return (
    <div style={{ padding: "25px 0 0 50px" }}>
      <div
        style={{
          display: "flex",
          background: "#feffeb",
          padding: "12px 15px",
        }}
      >
        {["Qty", "Description", "Unit Price", "Total"].map((h, i) => (
          <div
            key={h}
            style={{
              width: ["10%", "40%", "25%", "25%"][i],
              fontWeight: 800,
              color: navy,
            }}
          >
            {h}
          </div>
        ))}
      </div>

      <div style={{ background: "#feffeb", marginTop: 10 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              padding: "15px",
            }}
          >
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
    </div>
  );
};

export default ItemsBlock;
