import qrFallback from "../../../assets/templates/images (1).png";

const PaymentQRBlock = ({
  bankName,
  accountNo,
  ifscCode,
  signature,
  qrCode,
}) => {
  const navy = "#1f2a5a";

  return (
    <div style={{ width: 630 }}>
      {/* TOP ROW */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* LEFT — PAYMENT INFO */}
        <div>
          <p
            style={{
              fontWeight: 700,
              color: navy,
              marginBottom: 6,
            }}
          >
            PAYMENT INFO
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
          <div style={{ marginTop: 22, textAlign: "center" }}>
            {signature && (
              <img
                src={signature}
                style={{
                  height: 35,
                  display: "block",
                  margin: "0 auto 4px",
                  objectFit: "contain",
                }}
              />
            )}

            <div
              style={{
                width: 140,
                height: 2,
                background: navy,
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
          <p
            style={{
              fontWeight: 700,
              color: navy,
              marginBottom: 6,
            }}
          >
            SCAN TO PAY
          </p>

          <img
            src={qrCode || qrFallback}
            width={110}
            style={{ display: "block", margin: "0 auto 6px" }}
          />

          <p style={{ fontSize: 12, margin: 0 }}>
            Dynamic QR Code will
            <br />
            be inserted here
          </p>
        </div>
      </div>

      {/* THANK YOU */}
      <p
        style={{
          textAlign: "center",
          marginTop: 22,
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        THANK YOU FOR YOUR BUSINESS
      </p>
    </div>
  );
};

export default PaymentQRBlock;
