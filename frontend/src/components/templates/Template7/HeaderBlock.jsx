const HeaderBlock = ({
  companyName,
  companyAddress,
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  return (
    <div style={{ width: 600, display: "flex", justifyContent: "space-between" }}>
      <div>
        <p style={{ fontWeight: 800, fontSize: 26 }}>LOGO</p>
        <p style={{ fontSize: 22, fontWeight: 700 }}>{companyName}</p>
        <p>{companyAddress}</p>
      </div>

      <div>
        {[
          ["Invoice#", invoiceNumber],
          ["Invoice Date", invoiceDate],
          ["P.O#", poNumber],
          ["Due Date", dueDate],
        ].map(([l, v]) => (
          <p key={l}>
            {l}: <strong>{v}</strong>
          </p>
        ))}
      </div>
    </div>
  );
};

export default HeaderBlock;
