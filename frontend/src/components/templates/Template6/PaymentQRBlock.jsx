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
        width: 650,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {/* LEFT — Payment Info + Signature */}
      <div>
        <p><strong>Payment Info</strong></p>
        <p>Bank Name: {bankName}</p>
        <p>Account No: {accountNo}</p>
        <p>IFSC Code: {ifscCode}</p>

        <div style={{ marginTop: 25 }}>
          {signature && <img src={signature} height={40} />}
          <div
            style={{
              width: 140,
              borderTop: "2px solid #000",
              marginTop: 6,
            }}
          />
          <p style={{ fontWeight: 600 }}>Authorised Sign</p>
        </div>
      </div>

      {/* RIGHT — QR */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: 700 }}>Scan To Pay</p>
        <img
          src={qrCode || qrCodeImg}
          width={90}
          style={{ marginTop: 8 }}
        />
        <p style={{ fontSize: 11, marginTop: 6 }}>
          Dynamic QR Code will <br /> be inserted here
        </p>
      </div>
    </div>
  );
};

export default PaymentQRBlock;
