const InvoiceInfoBlock = ({
  invoiceNumber,
  invoiceDate,
  poNumber,
  dueDate,
}) => {
  return (
    <div style={{ lineHeight: 1.8 }}>
      <div><b>Invoice#</b> {invoiceNumber}</div>
      <div><b>Invoice Date</b> {invoiceDate}</div>
      <div><b>P.O#</b> {poNumber}</div>
      <div><b>Due Date</b> {dueDate}</div>
    </div>
  );
};

export default InvoiceInfoBlock;
