const TermsPaymentBlock = ({
  terms,
  bankName,
  accountNo,
  ifscCode,
  signature,
}) => {
  return (
    <div style={{ width: "100%", fontSize: 13 }}>
      <h4
        style={{
          fontSize: 14,
          fontWeight: 700,
          margin: "0 0 6px 0",
        }}
      >
        Terms & Conditions
      </h4>

      {terms.map((t, i) => (
        <p
          key={i}
          style={{
            margin: "2px 0",
            lineHeight: "18px",
          }}
        >
          ◆ {t}
        </p>
      ))}

      <h4
        style={{
          fontSize: 14,
          fontWeight: 700,
          margin: "10px 0 6px 0",
        }}
      >
        Payment Info
      </h4>

      <p style={{ margin: "2px 0" }}>
        <strong>Bank Name:</strong> {bankName}
      </p>

      <p style={{ margin: "2px 0" }}>
        <strong>Account No:</strong> {accountNo}
      </p>

      <p style={{ margin: "2px 0" }}>
        <strong>IFSC Code:</strong> {ifscCode}
      </p>


      {signature && (
  <div style={{ textAlign: "left", marginTop: 14 }}>
    <img
      src={signature}
      style={{
        height: 40,
        display: "block",
      }}
    />

    <div
      style={{
        width: 140,
        height: 1,
        background: "#555",
      }}
    />

    <p
      style={{
        fontSize: 11,
        fontWeight: 600,
        margin: 0,
      }}
    >
      Authorised Sign
    </p>
  </div>
)}


    </div>
  );
};

export default TermsPaymentBlock;
