import qrCodeImg from "../../../assets/templates/images (1).png";

const TermsPaymentQRBlock = ({
  terms,
  bankName,
  accountNo,
  ifscCode,
  qrCode,
  signature,
}) => {
  const pink = "#be549f";
  const gray = "#374151";

  return (
    <div
      style={{
        width: 700,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ width: "55%" }}>
        {/* TERMS */}
        <p
          style={{
            color: pink,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Terms and Conditions
        </p>

        {terms.map((t, i) => (
          <p
            key={i}
            style={{
              margin: "2px 0",
              color: gray,
              display: "flex",
              gap: 8,
            }}
          >
            <span style={{ color: pink }}>■</span>
            {t}
          </p>
        ))}

        {/* SPACE */}
        <div style={{ height: 16 }} />

        {/* PAYMENT */}
        <p
          style={{
            color: pink,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Payment Info
        </p>

        <p style={{ margin: "2px 0", color: gray }}>
          <strong>Bank Name:</strong> {bankName}
        </p>
        <p style={{ margin: "2px 0", color: gray }}>
          <strong>Account No:</strong> {accountNo}
        </p>
        <p style={{ margin: "2px 0", color: gray }}>
          <strong>IFSC Code:</strong> {ifscCode}
        </p>

        <p
          style={{
            marginTop: 14,
            fontWeight: 700,
            color: gray,
          }}
        >
          Thank you for your business
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div style={{ width: "40%" }}>
        {/* QR BOX */}
        <div
          style={{
            background: pink,
            padding: 18,
            textAlign: "center",
            color: "#fff",
          }}
        >
          <p
            style={{
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Scan To Pay
          </p>

          <img
            src={qrCode || qrCodeImg}
            alt=""
            style={{
              background: "#fff",
              padding: 6,
              margin: "0 auto",
              display: "block",
            }}
            width={90}
          />

          <p
            style={{
              marginTop: 8,
              fontSize: 12,
            }}
          >
            Dynamic QR Code will be inserted here
          </p>
        </div>

        {/* SIGNATURE */}
        <div style={{ textAlign: "center", marginTop: 22 }}>
          {signature && (
            <img
              src={signature}
              style={{
                height: 40,
                display: "block",
                margin: "0 auto 6px",
              }}
            />
          )}

          <div
            style={{
              width: 140,
              height: 2,
              background: "#000",
              margin: "0 auto 4px",
            }}
          />

          <p style={{ fontWeight: 700, margin: 0 }}>
            Authorised Sign
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPaymentQRBlock;
