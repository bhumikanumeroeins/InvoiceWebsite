import qrCodeImg from "../../../assets/templates/images (1).png";

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
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 18,
              letterSpacing: 1,
              color: navy,
              margin: "0 0 6px",
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
          <div style={{ marginTop: 20, textAlign: "center" }}>
            {signature && (
             <img
                src={signature}
                style={{
                  height: 35,           
                  maxWidth: 90,
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto 4px",
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

            <p
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 13,
                margin: 0,
              }}
            >
              AUTHORISED SIGN
            </p>
          </div>
        </div>

        {/* RIGHT — QR */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 18,
              letterSpacing: 1,
              margin: "0 0 6px",
              color: navy,
            }}
          >
            SCAN TO PAY
          </p>

          <img
            src={qrCode || qrCodeImg}
            width={95}
            style={{ display: "block", margin: "0 auto 6px" }}
          />

          <p style={{ fontSize: 11, margin: 0 }}>
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
