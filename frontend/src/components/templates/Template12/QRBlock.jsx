import qrCodeImg from "../../../assets/templates/images (1).png";

const QRBlock = ({ qrCode }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <b>Scan To Pay</b>
      <p style={{ fontSize: 12 }}>
        (Dynamic QR will be inserted here)
      </p>
      <img
        src={qrCode || qrCodeImg}
        style={{ width: 120, marginTop: 10 }}
      />
    </div>
  );
};

export default QRBlock;
