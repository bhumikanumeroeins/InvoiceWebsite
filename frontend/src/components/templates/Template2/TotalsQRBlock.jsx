import qrCodeImg from "../../../assets/templates/images (1).png";

const TotalsQRBlock = ({ subtotal, taxAmount, total, qrCode }) => {
  return (
    <div style={{ width: "45%" }}>
      <p>Subtotal {subtotal}</p>
      <p>Tax {taxAmount}</p>

      <div style={{ background: "#ffb701", padding: 10 }}>
        Total {total}
      </div>

      <div style={{ textAlign: "center" }}>
        <p>Scan To Pay</p>
        <img src={qrCode || qrCodeImg} width={90} />
      </div>
    </div>
  );
};

export default TotalsQRBlock;
