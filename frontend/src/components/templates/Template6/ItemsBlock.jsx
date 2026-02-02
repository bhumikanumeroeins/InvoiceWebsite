const ItemsBlock = ({ items }) => {
  return (
    <div style={{ width: 680 }}>
      <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 140px 140px",
            background: "#f3f4f6",
            padding: "12px",
            fontWeight: 700,          
            color: "#000",             
            letterSpacing: 0.4,
          }}
        >

        <div>QTY</div>
        <div>DESCRIPTION</div>
        <div>UNIT PRICE</div>
        <div>AMOUNT</div>
      </div>

      {items.map((i, idx) => (
        <div
            key={idx}
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 140px 140px",
              padding: "12px",
              borderBottom: "1px solid #ddd",
              fontWeight: 500,         
              color: "#111",
            }}
          >
          <div>{i.quantity}</div>
          <div>{i.description}</div>
          <div>{i.rate}</div>
          <div>{i.amount}</div>
        </div>
      ))}
    </div>
  );
};

export default ItemsBlock;
