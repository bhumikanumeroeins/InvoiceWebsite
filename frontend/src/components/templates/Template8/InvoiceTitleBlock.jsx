const InvoiceTitleBlock = ({
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  const purple = "#4a415d";
  const metaColor = "#6b647a";

  return (
    <div
      style={{
        width: 630,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center", 
      }}
    >
      {/* LEFT META */}
      <div
        style={{
          fontSize: 13,
          lineHeight: "20px",
          color: metaColor,
        }}
      >
        {[
          ["Invoice#", invoiceNumber],
          ["Invoice Date", invoiceDate],
          ["P.O#", poNumber],
          ["Due Date", dueDate],
        ].map(([l, v]) => (
          <div
            key={l}
            style={{
              display: "grid",
              gridTemplateColumns: "110px auto", 
              columnGap: 6,
            }}
          >
            <span>{l}:</span>

            <span
              style={{
                fontWeight: 700,
                color: purple,
              }}
            >
              {v}
            </span>
          </div>
        ))}

      </div>

      {/* RIGHT TITLE */}
      <div
        style={{
          fontSize: 52,                 
          fontFamily: "'Dela Gothic One', cursive",
          color: purple,
          letterSpacing: 0.5,
          marginTop: -2,              
        }}
      >
        INVOICE
      </div>
    </div>
  );
};

export default InvoiceTitleBlock;
