import qrCodeImg from "../../../assets/templates/images (1).png";

const TotalsQRBlock = ({ subtotal, taxAmount, total, qrCode }) => {
  const navy = "#12498e";
  const coral = "#ff6b6b";

  return (
    <div
      style={{
        width: 300, // ✅ prevents collapse
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Subtotal */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color: navy }}>Sub Total</span>
        <span style={{ color: coral }}>{subtotal}</span>
      </div>

      {/* Tax */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ color: navy }}>Tax</span>
        <span style={{ color: coral }}>{taxAmount}</span>
      </div>

      {/* TOTAL */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          background: "#fef3e2",
          padding: "12px 14px",
          marginBottom: 10,
        }}
      >
        <strong style={{ color: navy }}>TOTAL</strong>
        <strong style={{ color: coral }}>{total}</strong>
      </div>

      {/* QR BOX */}
      <div
        style={{
          background: "#fef3e2",
          padding: 12,
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontWeight: 700,
            color: navy,
            fontSize: 13,
          }}
        >
          Scan To Pay
        </p>

        <img
          src={qrCode || qrCodeImg}
          alt=""
          style={{
            width: 70,
            height: 70,
            display: "block",
          }}
        />
      </div>
    </div>
  );
};

export default TotalsQRBlock;
