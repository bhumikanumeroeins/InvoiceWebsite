import qrCodeImg from "../../../assets/templates/images (1).png";

const PaymentQRBlock = ({
  bankName,
  accountNo,
  ifscCode,
  qrCode,
  signature,
}) => {
  return (
    <div
      style={{
        width: 630,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <strong>Payment Info</strong>
        <p>Bank: {bankName}</p>
        <p>Account: {accountNo}</p>
        <p>IFSC: {ifscCode}</p>

        <div style={{ marginTop: 30, textAlign: "center" }}>
          {signature ? (
            <img src={signature} height={40} />
          ) : (
            <div
              style={{
                width: 120,
                borderBottom: "1px solid #000",
                margin: "0 auto",
              }}
            />
          )}
          <p>Authorised Sign</p>
        </div>
      </div>

      <div
        style={{
          background: "#fdeccd",
          padding: "12px 18px",
          textAlign: "center",
        }}
      >
        <strong>Scan To Pay</strong>
        <img src={qrCode || qrCodeImg} width={100} />
        <p style={{ fontSize: 10 }}>
          Dynamic QR Code will <br /> be inserted here
        </p>
      </div>
    </div>
  );
};

export default PaymentQRBlock;
