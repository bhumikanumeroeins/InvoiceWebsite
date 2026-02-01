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
        {signature && (
          <img
            src={signature}
            style={{
              height: 35,
              display: "block",
              margin: "0 auto 6px",
              objectFit: "contain",
            }}
          />
        )}

        <div
          style={{
            width: 150,
            height: 2,
            background: "#000",
            margin: "0 auto 6px",
          }}
        />
        <p>Authorised Sign</p>
      </div>
    </div>
  );
};

export default PaymentBlock;
