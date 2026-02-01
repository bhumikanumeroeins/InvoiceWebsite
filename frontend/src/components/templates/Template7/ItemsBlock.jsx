const ItemsBlock = ({ items }) => {
  return (
    <div style={{ width: 600 }}>

      {/* header */}
      <div style={{ display: "flex", fontWeight: 700, marginBottom: 10 }}>
        {["Qty", "Description", "Unit Price", "Amount"].map((h, i) => (
          <div key={h} style={{ width: ["10%","45%","20%","25%"][i] }}>
            {h}
          </div>
        ))}
      </div>

      {/* boxed rows */}
      <div style={{ border: "2px solid #111", padding: "10px 15px" }}>
        {items.map((i, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              padding: "10px 0",
            }}
          >
            <div style={{ width: "10%" }}>{idx + 1}.</div>
            <div style={{ width: "45%" }}>{i.description}</div>
            <div style={{ width: "20%" }}>{i.rate}</div>
            <div style={{ width: "25%" }}>{i.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsBlock;
