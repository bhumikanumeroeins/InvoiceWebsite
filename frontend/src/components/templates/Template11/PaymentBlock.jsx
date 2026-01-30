const PaymentBlock = ({
  bankName,
  accountNo,
  ifscCode,
  signature,
}) => {
  return (
    <div style={{ width: 300 }}>
      <b>Payment Info</b>

      <p><b>Bank Name:</b> {bankName}</p>
      <p><b>Account No:</b> {accountNo}</p>
      <p><b>IFSC Code:</b> {ifscCode}</p>

      <div style={{ marginTop: 30, textAlign: "center" }}>
        {signature ? (
          <img src={signature} style={{ height: 40 }} />
        ) : (
          <div
            style={{
              borderBottom: "1px solid #000",
              width: 150,
              margin: "0 auto",
            }}
          />
        )}

        <p>Authorised Sign</p>
      </div>
    </div>
  );
};

export default PaymentBlock;
