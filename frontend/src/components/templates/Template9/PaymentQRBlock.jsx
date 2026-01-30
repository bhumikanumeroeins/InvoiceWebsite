import qrCodeImg from "../../../assets/templates/images (1).png";

const PaymentQRBlock = ({
  bankName,
  accountNo,
  ifscCode,
  signature,
  qrCode,
}) => {
  return (
    <div style={{ width: 630, display: "flex", justifyContent: "space-between" }}>
      <div>
        <p style={{ fontFamily: "Bebas Neue", fontSize: 20 }}>Payment Info</p>
        <p>Bank Name: {bankName}</p>
        <p>Account No: {accountNo}</p>
        <p>IFSC Code: {ifscCode}</p>

        <div style={{ marginTop: 20, textAlign: "center" }}>
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

      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: 700 }}>Scan To Pay</p>
        <img src={qrCode || qrCodeImg} width={100} />
        <p style={{ fontSize: 11 }}>
          Dynamic QR Code will <br /> be inserted here
        </p>
      </div>
    </div>
  );
};

export default PaymentQRBlock;
