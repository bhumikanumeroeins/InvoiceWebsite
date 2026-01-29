import qrCodeImg from "../../../assets/templates/images (1).png";

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  marginBottom: 4,
  fontSize: 14,
};

const TotalsQRBlock = ({ subtotal, taxAmount, total, qrCode }) => {
  return (
    <div style={{ width: "55%" }}>
      {/* Subtotal */}
      <div style={rowStyle}>
        <span>Sub Total</span>
        <span>{subtotal}</span>
      </div>

      {/* Tax */}
      <div style={rowStyle}>
        <span>Tax</span>
        <span>{taxAmount}</span>
      </div>

      {/* Total */}
      <div
        style={{
          ...rowStyle,
          background: "#ffb701",
          padding: "8px 10px",
          fontWeight: "bold",
          marginTop: 6,
        }}
      >
        <span>Total</span>
        <span>{total}</span>
      </div>

      {/* QR */}
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <p>Scan To Pay</p>
        <img src={qrCode || qrCodeImg} width={90} />
      </div>
    </div>
  );
};

export default TotalsQRBlock;
