const TermsPaymentBlock = ({
  terms,
  bankName,
  accountNo,
  ifscCode,
  signature,
}) => {
  return (
    <div style={{ width: "45%" }}>
      <h4>Terms & Conditions</h4>

      {terms.map((t, i) => (
        <p key={i}>◆ {t}</p>
      ))}

      <h4>Payment Info</h4>
      <p>Bank: {bankName}</p>
      <p>Acc: {accountNo}</p>
      <p>IFSC: {ifscCode}</p>

      {signature && <img src={signature} height={40} />}
      <p>Authorised Sign</p>
    </div>
  );
};

export default TermsPaymentBlock;
