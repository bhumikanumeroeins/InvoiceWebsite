import paymentBoxImg from "../../../assets/templates/1_2.png";
import scanBoxImg from "../../../assets/templates/1_3.png";
import qrCodeImg from "../../../assets/templates/images (1).png";

const PaymentBlock = ({
  bankName,
  accountNo,
  ifscCode,
  qrCode,
  signature,
}) => {
  const magenta = "#e91e8c";
  const darkBg = "#0d1021";

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "0 50px",
        width: "700px",
        alignItems: "flex-end",
      }}
    >
      {/* PAYMENT BOX */}
      <div style={{ width: "220px", position: "relative" }}>
        <img
          src={paymentBoxImg}
          alt="Payment Box"
          style={{ width: "100%", height: "auto" }}
        />

        {/* TITLE */}
        <p
          style={{
            position: "absolute",
            top: "18px",
            left: "12px",
            fontWeight: 800,
            fontSize: "13px",
            letterSpacing: "1px",
            margin: 0,
            color: darkBg,
          }}
        >
          PAYMENT INFORMATION
        </p>

        {/* DETAILS */}
        <div
          style={{
            position: "absolute",
            top: "45px",
            left: "12px",
            right: "12px",
            fontSize: "11px",
          }}
        >
          <div style={{ display: "flex", marginBottom: 2 }}>
            <span style={{ width: 80, color: "#777" }}>Bank:</span>
            <span style={{ fontWeight: 600 }}>{bankName}</span>
          </div>

          <div style={{ display: "flex", marginBottom: 2 }}>
            <span style={{ width: 80, color: "#777" }}>Account:</span>
            <span style={{ fontWeight: 600 }}>{accountNo}</span>
          </div>

          <div style={{ display: "flex" }}>
            <span style={{ width: 80, color: "#777" }}>IFSC:</span>
            <span style={{ fontWeight: 600 }}>{ifscCode}</span>
          </div>
        </div>
      </div>

      {/* SIGNATURE */}
      <div
        style={{
          flex: 1,
          textAlign: "center",
          paddingBottom: "8px",
        }}
      >
        {signature ? (
          <img
            src={signature}
            alt="Signature"
            style={{ height: "40px", marginBottom: "6px" }}
          />
        ) : (
          <div
            style={{
              height: "40px",
              width: "90px",
              margin: "0 auto 6px",
              borderBottom: `2px solid ${magenta}`,
            }}
          />
        )}

        <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>
          Authorised Sign
        </p>
      </div>

      {/* QR BOX */}
      <div style={{ width: "160px", textAlign: "center" }}>
        <div style={{ position: "relative" }}>
          <img
            src={scanBoxImg}
            alt="Scan Box"
            style={{ width: "100%", height: "auto" }}
          />

          {/* TITLE */}
          <p
            style={{
              position: "absolute",
              top: "20px",
              left: "58%",
              transform: "translateX(-50%)",
              fontWeight: 800,
              fontSize: "11px",
              margin: 0,
              color: magenta,
              whiteSpace: "nowrap",
            }}
          >
            SCAN TO PAY
          </p>

          {/* QR IMAGE */}
          <div
            style={{
              position: "absolute",
              top: "42px",
              left: "55%",
              transform: "translateX(-50%)",
            }}
          >
            <img
              src={qrCode || qrCodeImg}
              alt="QR"
              style={{ width: "75px", height: "75px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentBlock;
