import bracketImg from "../../../assets/templates/1.jpg";

const HeaderBlock = ({
  logo,
  companyName,
  companyAddress,
  billToName,
  billToAddress,
  shipToName,
  shipToAddress,
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  const magenta = "#e91e8c";

  return (
    <div style={{ padding: "95px 50px 30px", width: 700 }}>
      {/* Logo */}
      {logo ? (
        <img src={logo} alt="logo" style={{ height: 90 }} />
      ) : (
        <span style={{ color: magenta, fontWeight: 700 }}>LOGO</span>
      )}

      {/* Company */}
      <p style={{ fontWeight: 700 }}>{companyName}</p>
      <p>{companyAddress}</p>

      {/* Bill / Ship / Details */}
      <div style={{ display: "flex", marginTop: 20 }}>
        <div style={{ width: 170 }}>
          <strong>BILL TO</strong>
          <p>{billToName}</p>
          <p>{billToAddress}</p>
        </div>

        <img src={bracketImg} alt="" height={70} />

        <div style={{ width: 170 }}>
          <strong>SHIP TO</strong>
          <p>{shipToName}</p>
          <p>{shipToAddress}</p>
        </div>

        <img src={bracketImg} alt="" height={70} />

        <div style={{ flex: 1 }}>
          {[
            ["Invoice#", invoiceNumber],
            ["Date", invoiceDate],
            ["PO#", poNumber],
            ["Due", dueDate],
          ].map(([l, v]) => (
            <div
              key={l}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <strong>{l}</strong>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderBlock;
