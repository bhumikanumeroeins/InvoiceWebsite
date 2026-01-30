const teal = "#2bb6b1";

const MetaBlock = ({ invoiceNumber, invoiceDate, poNumber, dueDate }) => {
  return (
    <div style={{ display: "flex", gap: 40 }}>
      {[
        ["Invoice#", invoiceNumber],
        ["Invoice Date", invoiceDate],
        ["P.O#", poNumber],
        ["Due Date", dueDate],
      ].map(([label, value]) => (
        <div key={label} style={{ textAlign: "center" }}>
          <div
            style={{
              background: teal,
              color: "#fff",
              padding: "10px 22px",
              fontWeight: 700,
            }}
          >
            {label}
          </div>
          <div style={{ marginTop: 8 }}>{value}</div>
        </div>
      ))}
    </div>
  );
};

export default MetaBlock;
