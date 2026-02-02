const PaymentBlock = ({
  bankName,
  accountNo,
  ifscCode,
  signature,
}) => {
  return (
    <div>
      <b>Payment Info</b>
      <p>
        <b>Bank Name:</b> {bankName}
      </p>
      <p>
        <b>Account No:</b> {accountNo}
      </p>
      <p>
        <b>IFSC Code:</b> {ifscCode}
      </p>

      <div style={{ marginTop: 20 }}>
        {signature && (
          <img src={signature} style={{ height: 40 }} />
        )}
        <p>Authorised Sign</p>
      </div>
    </div>
  );
};

export default PaymentBlock;
