import qrCodeImg from "../../../assets/templates/images (1).png";

const PaymentQRBlock = ({
  qrCode,
  signature,
}) => {
  return (
    <div
      style={{
        width: 555,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <div style={{ textAlign: "center" }}>
        {/* Scan To Pay */}
        <p
          style={{
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Scan to Pay
        </p>

        {/* QR */}
        <img
          src={qrCode || qrCodeImg}
          width={90}
          style={{ display: "block", margin: "0 auto" }}
        />

        {/* Dynamic Text */}
        <p
          style={{
            fontSize: 11,
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          Dynamic QR Code will
          <br />
          be inserted here
        </p>

        {/* Signature */}
        <div style={{ marginTop: 16 }}>
          {signature && (
            <img
              src={signature}
              alt="signature"
              style={{
                height: 56,          
                display: "block",
                margin: "0 auto 8px",
              }}
            />
          )}

          <div
            style={{
              borderTop: "3px solid #3b2c80", 
              width: 180,                     
              margin: "0 auto 6px",
            }}
          />

          <p
            style={{
              fontWeight: 700,
              margin: 0,
            }}
          >
            Authorised Sign
          </p>

        </div>
      </div>
    </div>
  );
};

export default PaymentQRBlock;
