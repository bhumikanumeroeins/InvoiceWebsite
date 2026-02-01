const TermsPaymentBlock = ({
  terms,
  bankName,
  accountNo,
  ifscCode,
  signature,
}) => {
  const navy = "#12498e";
  const coral = "#ff6b6b";

  return (
    <div>
      {/* Terms */}
      <h4
        style={{
          color: navy,
          fontFamily: "'Orbitron', sans-serif",
          marginBottom: 6,
          fontWeight: 700,
        }}
      >
        Terms and Conditions
      </h4>

      {terms.map((t, i) => (
        <p
          key={i}
          style={{
            color: coral,
            margin: "2px 0",
            fontSize: 13,
          }}
        >
          {t}
        </p>
      ))}

      {/* Space between blocks */}
      <div style={{ height: 18 }} />

      {/* Payment */}
      <h4
        style={{
          color: navy,
          fontFamily: "'Orbitron', sans-serif",
          marginBottom: 6,
          fontWeight: 700,
        }}
      >
        Payment Info
      </h4>

      <p style={{ margin: "2px 0" }}>
        Bank: <span style={{ color: coral }}>{bankName}</span>
      </p>
      <p style={{ margin: "2px 0" }}>
        Acc: <span style={{ color: coral }}>{accountNo}</span>
      </p>
      <p style={{ margin: "2px 0" }}>
        IFSC: <span style={{ color: coral }}>{ifscCode}</span>
      </p>

      {/* Signature */}
      {signature && (
        <div style={{ textAlign: "left", marginTop: 12 }}>
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
              background: navy,
            }}
          />

          <p
            style={{
              color: navy,
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
