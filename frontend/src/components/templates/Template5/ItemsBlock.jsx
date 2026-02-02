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
          <div
            key={h}
            style={{
              width: ["10%", "45%", "22%", "23%"][i],
              fontFamily: "'Passion One', cursive",
              fontSize: 19,
              letterSpacing: 0.5,
              color: "#4b3a77",  
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
            background: i % 2 === 0 ? "#efe3ff" : "#f6f0ff",
            borderRadius: 18,
            padding: "8px 15px",
            marginBottom: 6,
            color: "#4b3a77",
          }}
        >
          <div style={{ width: "10%" }}>{item.quantity}</div>
          <div style={{ width: "45%" }}>{item.description}</div>
          <div style={{ width: "22%" }}>{item.rate}</div>
          <div style={{ width: "23%" }}>{item.amount}</div>
        </div>
      ))}
    </div>
  );
};

export default ItemsBlock;
