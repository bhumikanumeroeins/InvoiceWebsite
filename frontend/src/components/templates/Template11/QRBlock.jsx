import qrCodeImg from "../../../assets/templates/images (1).png";

const QRBlock = ({ qrCode }) => {
  return (
    <div
      style={{
        width: 220,
        background: "#eef2f5",
        padding: 15,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <b>Scan To Pay</b>

      <img
        src={qrCode || qrCodeImg}
        style={{ width: 130, margin: "10px 0" }}
      />

      <p style={{ fontSize: 12, textAlign: "center" }}>
        Dynamic QR Code will <br /> be inserted here
      </p>
    </div>
  );
};

export default QRBlock;
