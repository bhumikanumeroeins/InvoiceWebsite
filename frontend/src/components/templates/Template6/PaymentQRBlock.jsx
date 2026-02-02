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
        {/* TOP BORDER */}
        <div
          style={{
            width: 220,
            borderTop: "2px solid #ddd",
            marginBottom: 10,
          }}
        />

        <p style={{ fontWeight: 800, marginBottom: 6 }}>
          Payment Info
        </p>

        <p style={{ margin: "2px 0" }}>
          <strong>Bank Name:</strong> {bankName}
        </p>

        <p style={{ margin: "2px 0" }}>
          <strong>Account No:</strong> {accountNo}
        </p>

        <p style={{ margin: "2px 0" }}>
          <strong>IFSC Code:</strong> {ifscCode}
        </p>

        {/* SIGNATURE */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          {signature && (
            <img
              src={signature}
              alt="signature"
              style={{
                height: 46,
                display: "block",
                margin: "0 auto 6px",
              }}
            />
          )}

          <div
            style={{
              width: 160,
              borderTop: "2px solid #000",
              margin: "0 auto 4px",
            }}
          />

          <p style={{ fontWeight: 700, margin: 0 }}>
            Authorised Sign
          </p>
        </div>
      </div>

      {/* RIGHT — QR */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: 800, marginBottom: 6 }}>
          Scan To Pay
        </p>

        <img
          src={qrCode || qrCodeImg}
          width={90}
          style={{ marginTop: 6 }}
        />

        <p style={{ fontSize: 11, marginTop: 6 }}>
          Dynamic QR Code will <br /> be inserted here
        </p>
      </div>
    </div>
  );
};

export default PaymentQRBlock;
