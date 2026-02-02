import qrCodeImg from "../../../assets/templates/images (1).png";

const TotalsQRBlock = ({ subtotal, taxAmount, total, qrCode }) => {
  const navy = "#12498e";
  const coral = "#ff6b6b";

  return (
    <div
      style={{
        width: 300,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Subtotal */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color: navy, fontWeight: 700 }}>Sub Total</span>
        <span style={{ color: coral, fontWeight: 700 }}>{subtotal}</span>
      </div>

      {/* Tax */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ color: navy, fontWeight: 700 }}>Tax</span>
        <span style={{ color: coral, fontWeight: 700 }}>{taxAmount}</span>
      </div>

      {/* TOTAL */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fef3e2",
          padding: "14px 16px",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            color: navy,
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: 1,
          }}
        >
          TOTAL
        </span>

        <span
          style={{
            color: coral,
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          {total}
        </span>
      </div>

      {/* QR BOX */}
      <div
        style={{
          background: "#fef3e2",
          padding: 16,
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: "0 0 10px",
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
            width: 90,
            height: 90,
            display: "block",
            margin: "0 auto",
          }}
        />

        <p
          style={{
            marginTop: 8,
            fontSize: 11,
            color: coral,
          }}
        >
          Dynamic QR Code will be inserted here
        </p>
      </div>
    </div>
  );
};

export default TotalsQRBlock;
