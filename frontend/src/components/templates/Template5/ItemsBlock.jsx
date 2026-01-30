const ItemsBlock = ({ items }) => {
  return (
    <div style={{ width: 630 }}>
      <div
        style={{
          display: "flex",
          background: "#efe3ff",
          borderRadius: 20,
          padding: "10px 15px",
          marginBottom: 10,
        }}
      >
        {["Qty", "Description", "Unit Price", "Amount"].map((h, i) => (
          <div key={h} style={{ width: ["10%","45%","22%","23%"][i] }}>
            {h}
          </div>
        ))}
      </div>

      {items.map((item, i) => (
        <div key={i} style={{ display: "flex" }}>
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
