import qrFallback from "../../../assets/templates/images (1).png";

const PaymentSignatureQRBlock = ({
  bankName,
  accountNo,
  ifscCode,
  qrCode,
  signature,
}) => {
  return (
    <div
      style={{
        width: 600,
        display: "grid",
        gridTemplateColumns: "40% 20% 40%",
      }}
    >
      <div>
        <strong>Payment Info</strong>
        <p>{bankName}</p>
        <p>{accountNo}</p>
        <p>{ifscCode}</p>
      </div>

      <div style={{ textAlign: "center" }}>
        {signature && <img src={signature} height={40} />}
        <p>Authorised Sign</p>
      </div>

      <div style={{ textAlign: "center" }}>
        <strong>Scan To Pay</strong>
        <img src={qrCode || qrFallback} width={90} />
        <p style={{ fontSize: 10 }}>
          Dynamic QR Code will <br /> be inserted here
        </p>
      </div>
    </div>
  );
};

export default PaymentSignatureQRBlock;
