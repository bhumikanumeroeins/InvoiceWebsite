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
      <h4 style={{ color: navy }}>Terms and Conditions</h4>

      {terms.map((t, i) => (
        <p key={i} style={{ color: coral }}>
          {t}
        </p>
      ))}

      <h4 style={{ color: navy }}>Payment Info</h4>

      <p>
        Bank: <span style={{ color: coral }}>{bankName}</span>
      </p>
      <p>
        Acc: <span style={{ color: coral }}>{accountNo}</span>
      </p>
      <p>
        IFSC: <span style={{ color: coral }}>{ifscCode}</span>
      </p>

      {signature && <img src={signature} height={40} />}

      <p style={{ color: navy }}>Authorised Sign</p>
    </div>
  );
};

export default TermsPaymentBlock;
