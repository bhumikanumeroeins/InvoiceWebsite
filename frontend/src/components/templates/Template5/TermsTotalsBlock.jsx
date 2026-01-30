const TermsTotalsBlock = ({
  terms,
  bankName,
  accountNo,
  ifscCode,
  subtotal,
  taxAmount,
  total,
}) => {
  return (
    <div
      style={{
        width: 700,
        display: "flex",
        justifyContent: "space-between",
        gap: 30,
      }}
    >
      {/* LEFT — TERMS + PAYMENT INFO */}
      <div style={{ width: "45%" }}>
        <p style={{ fontWeight: 700, marginBottom: 8 }}>
          Terms and Conditions
        </p>

        {terms.map((t, i) => (
          <p key={i} style={{ margin: "4px 0" }}>
            • {t}
          </p>
        ))}

        <div style={{ marginTop: 16 }}>
          <p style={{ fontWeight: 700, marginBottom: 6 }}>
            Payment Info
          </p>

          <p>Bank Name: {bankName}</p>
          <p>Account No: {accountNo}</p>
          <p>IFSC Code: {ifscCode}</p>
        </div>
      </div>

      {/* RIGHT — TOTALS */}
      <div style={{ width: "40%" }}>
        {[
          ["Sub total", subtotal],
          ["Tax", taxAmount],
          ["Total", total],
        ].map(([l, v]) => (
          <div
            key={l}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
              fontWeight: l === "Total" ? 700 : 500,
            }}
          >
            <span>{l}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsTotalsBlock;
