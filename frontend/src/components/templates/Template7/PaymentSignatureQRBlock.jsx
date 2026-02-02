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
        alignItems: "flex-start",
      }}
    >
      {/* LEFT — PAYMENT INFO */}
      <div>
        {/* top divider */}
        <div
          style={{
            width: 160,
            borderTop: "2px solid #000",
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
      </div>

      {/* CENTER — SIGNATURE */}
      <div style={{ textAlign: "center", marginTop: 22 }}>
        {signature && (
          <img
            src={signature}
            alt="signature"
            style={{
              height: 48,
              display: "block",
              margin: "0 auto 6px",
            }}
          />
        )}

        <div
          style={{
            width: 150,
            borderTop: "2px solid #000",
            margin: "0 auto 4px",
          }}
        />

        <p style={{ fontWeight: 700, margin: 0 }}>
          Authorised Sign
        </p>
      </div>

      {/* RIGHT — QR */}
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p style={{ fontWeight: 800, marginBottom: 6 }}>
          Scan To Pay
        </p>

        <img
          src={qrCode || qrFallback}
          alt=""
          width={90}
          style={{
            display: "block",
            margin: "6px auto",
          }}
        />

        <p
          style={{
            fontSize: 11,
            marginTop: 4,
            textAlign: "center",
          }}
        >
          Dynamic QR Code will <br /> be inserted here
        </p>
      </div>
    </div>
  );
};

export default PaymentSignatureQRBlock;
