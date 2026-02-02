import qrCodeImg from "../../../assets/templates/images (1).png";

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  marginBottom: 6,
  fontSize: 13,
};

const TotalsQRBlock = ({ subtotal, taxAmount, total, qrCode }) => {
  return (
    <div style={{ width: "90%" }}>
      {/* Subtotal */}
      <div style={rowStyle}>
        <span style={{ fontWeight: 700 }}>Sub Total</span>
        <span style={{ fontWeight: 600 }}>{subtotal}</span>
      </div>

      {/* Tax */}
      <div style={rowStyle}>
        <span style={{ fontWeight: 700 }}>Tax</span>
        <span style={{ fontWeight: 600 }}>{taxAmount}</span>
      </div>


      {/* Total */}
      <div
        style={{
          ...rowStyle,
          background: "#ffb701",
          padding: "10px 14px",
          fontWeight: 700,
          marginTop: 8,
          marginBottom: 12,
        }}
      >
        <span>Total</span>
        <span>{total}</span>
      </div>

      {/* QR */}
      <div style={{ textAlign: "center", marginTop: 6 }}>
        <p
          style={{
            margin: "0 0 6px 0",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Scan To Pay
        </p>

        <img src={qrCode || qrCodeImg} width={105} style={{ margin: "0 auto", display: "block" }} />

        <p
          style={{
            marginTop: 6,
            fontSize: 11,
            opacity: 0.8,
          }}
        >
          Dynamic QR code will be inserted here
        </p>
      </div>
    </div>
  );
};


export default TotalsQRBlock;
