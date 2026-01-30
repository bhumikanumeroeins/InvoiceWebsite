const ItemsBlock = ({ items }) => {
  return (
    <div style={{ width: 680 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 140px 140px",
          background: "#f3f4f6",
          padding: "12px",
          fontWeight: 600,
        }}
      >
        <div>QTY</div>
        <div>DESCRIPTION</div>
        <div style={{ textAlign: "center" }}>UNIT PRICE</div>
        <div style={{ textAlign: "right" }}>AMOUNT</div>
      </div>

      {items.map((i, idx) => (
        <div
          key={idx}
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 140px 140px",
            padding: "12px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <div>{i.quantity}</div>
          <div>{i.description}</div>
          <div style={{ textAlign: "center" }}>{i.rate}</div>
          <div style={{ textAlign: "right" }}>{i.amount}</div>
        </div>
      ))}
    </div>
  );
};

export default ItemsBlock;
