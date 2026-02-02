const ItemsBlock = ({ items }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 35,
        left: "43%",
        transform: "translateX(-50%)",
        width: "87%",
      }}
    >
      <div style={{ display: "flex" }}>
        {["Qty", "Description", "Unit Price", "Amount"].map((h, i) => (
          <div
            key={h}
            style={{
              width: ["12%", "38%", "25%", "25%"][i],
              padding: "10px 12px",
              background: ["#009ba0", "#009ba0", "#ffb701", "#ff76aa"][i],
              fontWeight: 700,
              color: "#000",
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", borderBottom: "1px solid #555" }}>
          <div style={{ width: "12%", textAlign: "center" }}>
            {item.quantity}
          </div>
          <div style={{ width: "38%" }}>{item.description}</div>
          <div
            style={{
              width: "25%",
              textAlign: "center",
              paddingRight: 12,
            }}
          >
            {item.rate}
          </div>

          <div
            style={{
              width: "25%",
              textAlign: "center",
              paddingRight: 12,
              fontWeight: 600,
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
