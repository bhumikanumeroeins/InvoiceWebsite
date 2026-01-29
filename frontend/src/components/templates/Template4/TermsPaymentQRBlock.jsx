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
    <div style={{ width: 700, display: "flex", justifyContent: "space-between" }}>
      <div style={{ width: "55%" }}>
        <p style={{ color: pink }}>Terms</p>
        {terms.map((t, i) => (
          <p key={i}>{t}</p>
        ))}

        <p style={{ color: pink }}>Payment Info</p>
        <p>{bankName}</p>
        <p>{accountNo}</p>
        <p>{ifscCode}</p>
      </div>

      <div style={{ width: "40%" }}>
        <div style={{ background: pink, padding: 15, textAlign: "center" }}>
          <p style={{ color: "#fff" }}>Scan To Pay</p>
          <img
            src={qrCode || qrCodeImg}
            alt=""
            style={{ background: "#fff", padding: 5 }}
            width={80}
          />
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          {signature && <img src={signature} height={40} />}
          <p>Authorised Sign</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPaymentQRBlock;
