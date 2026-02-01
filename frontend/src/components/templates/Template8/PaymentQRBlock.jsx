import qrCodeImg from "../../../assets/templates/images (1).png";

const PaymentQRBlock = ({
  bankName,
  accountNo,
  ifscCode,
  qrCode,
  signature,
}) => {
  const purple = "#4a415d";

  return (
    <div
      style={{
        width: 630,
        display: "flex",
        justifyContent: "space-between",
        marginTop: 20,
      }}
    >
      {/* LEFT — PAYMENT INFO */}
      <div>
        <p
          style={{
            fontWeight: 700,
            fontSize: 15,
            marginBottom: 6,
            color: purple,
          }}
        >
          Payment Info
        </p>

        <p style={{ margin: "3px 0" }}>
          <strong>Bank Name:</strong> {bankName}
        </p>
        <p style={{ margin: "3px 0" }}>
          <strong>Account No:</strong> {accountNo}
        </p>
        <p style={{ margin: "3px 0" }}>
          <strong>IFSC Code:</strong> {ifscCode}
        </p>

        {/* SIGNATURE */}
        <div
          style={{
            marginTop: 26,
            textAlign: "center",
          }}
        >
          {signature && (
            <img
              src={signature}
              height={38}
              style={{ display: "block", margin: "0 auto 6px" }}
            />
          )}

          <div
            style={{
              width: 150,
              height: 2,
              background: purple,
              margin: "0 auto 6px",
            }}
          />

          <p
            style={{
              fontWeight: 700,
              fontSize: 13,
              margin: 0,
            }}
          >
            Authorised Sign
          </p>
        </div>
      </div>

      {/* RIGHT — QR */}
      <div
        style={{
          background: "#fdeccd",
          padding: "18px 22px",
          textAlign: "center",
          borderRadius: 4,
          minWidth: 190,
        }}
      >
        <p
          style={{
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 8,
            color: purple,
          }}
        >
          Scan To Pay
        </p>

        <img
          src={qrCode || qrCodeImg}
          width={95}
          style={{
            display: "block",
            margin: "0 auto 6px",
          }}
        />

        <p
          style={{
            fontSize: 11,
            margin: 0,
            color: purple,
            lineHeight: 1.4,
          }}
        >
          Dynamic QR Code will
          <br />
          be inserted here
        </p>
      </div>
    </div>
  );
};


export default PaymentQRBlock;
