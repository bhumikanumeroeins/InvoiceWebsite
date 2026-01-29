const HeaderBlock = ({
  logo,
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  return (
    <div style={{ position: "absolute", top: 30, right: 40 }}>
      {logo && <img src={logo} height={35} />}

      <h1 style={{ color: "#fff", fontSize: 42 }}>INVOICE.</h1>

      <div style={{ background: "#000", padding: 15 }}>
        {[
          ["Invoice#", invoiceNumber],
          ["Invoice Date", invoiceDate],
          ["P.O#", poNumber],
          ["Due Date", dueDate],
        ].map(([l, v]) => (
          <div
            key={l}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span style={{ color: "#fff" }}>{l}</span>
            <span style={{ color: "#fff" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderBlock;
