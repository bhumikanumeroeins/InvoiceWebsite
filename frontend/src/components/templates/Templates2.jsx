import bgImage from '../../assets/templates/1_4.jpeg';
import qrCodeImg from '../../assets/templates/images (1).png';
import { getInvoiceData } from '../../utils/invoiceDefaults';

const Templates2 = ({ data = {} }) => {
  const {
    logo, companyName, companyAddress, billToName, billToAddress,
    shipToName, shipToAddress, invoiceNumber, invoiceDate, poNumber,
    dueDate, items, terms, subtotal, taxAmount, total, bankName,
    accountNo, ifscCode, signature, qrCode, email, phone, website
  } = getInvoiceData(data);

  return (
    <div 
      style={{ 
        width: '794px', 
        height: '1123px', 
        position: 'relative',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: '794px 1123px',
        backgroundPosition: 'top left',
        backgroundRepeat: 'no-repeat',
        fontFamily: "'Fira Sans', sans-serif",
      }}
    >

      {/* HEADER - Right Side Content */}
      <div style={{ position: 'absolute', top: '30px', right: '50px', textAlign: 'left' }}>
        {/* Logo */}
        <div style={{ marginBottom: '8px' }}>
          {logo ? (
            <img src={logo} alt="Logo" style={{ height: '35px' }} />
          ) : (
            <span style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700' }}>LOGO</span>
          )}
        </div>
        
        {/* INVOICE Title */}
        <h1 style={{ color: '#ffffff', fontSize: '42px', fontWeight: '700', margin: '0 0 20px 0', letterSpacing: '2px' }}>INVOICE.</h1>
        
        {/* Invoice Details Box - Black background */}
        <div style={{ backgroundColor: '#000000', padding: '15px 20px', minWidth: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>Invoice#</span>
            <span style={{ color: '#ffffff', fontSize: '14px' }}>{invoiceNumber}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>Invoice Date</span>
            <span style={{ color: '#ffffff', fontSize: '14px' }}>{invoiceDate}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>P.O#</span>
            <span style={{ color: '#ffffff', fontSize: '14px' }}>{poNumber}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>Due Date</span>
            <span style={{ color: '#ffffff', fontSize: '14px' }}>{dueDate}</span>
          </div>
        </div>
      </div>

      {/* Company, Bill To, Ship To Section */}
      <div style={{ position: 'absolute', top: '360px', left: '50%', transform: 'translateX(-50%)', width: '85%', display: 'flex', justifyContent: 'space-between' }}>
        {/* Company Info */}
        <div style={{ width: '30%' }}>
          <p style={{ color: '#000000', fontWeight: '700', fontSize: '16px', margin: '0 0 5px 0' }}>{companyName}</p>
          <p style={{ color: '#4b5563', fontSize: '14px', margin: 0, whiteSpace: 'pre-line', lineHeight: '1.6' }}>{companyAddress}</p>
        </div>
        
        {/* Bill To */}
        <div style={{ width: '30%' }}>
          <p style={{ color: '#000000', fontWeight: '700', fontSize: '16px', margin: '0 0 5px 0' }}>Bill To</p>
          <p style={{ color: '#4b5563', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{billToName}</p>
          <p style={{ color: '#4b5563', fontSize: '14px', margin: 0, whiteSpace: 'pre-line', lineHeight: '1.6' }}>{billToAddress}</p>
        </div>
        
        {/* Ship To */}
        <div style={{ width: '30%' }}>
          <p style={{ color: '#000000', fontWeight: '700', fontSize: '16px', margin: '0 0 5px 0' }}>Ship To</p>
          <p style={{ color: '#4b5563', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{shipToName}</p>
          <p style={{ color: '#4b5563', fontSize: '14px', margin: 0, whiteSpace: 'pre-line', lineHeight: '1.6' }}>{shipToAddress}</p>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div style={{ position: 'absolute', top: '470px', left: '50%', transform: 'translateX(-50%)', width: '85%' }}>
        {/* Table Header */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12%', backgroundColor: '#009ba0', padding: '10px 15px', color: '#000000', fontSize: '17px', fontWeight: '700' }}>Qty</div>
          <div style={{ width: '38%', backgroundColor: '#009ba0', padding: '10px 15px', color: '#000000', fontSize: '17px', fontWeight: '700' }}>Description</div>
          <div style={{ width: '25%', backgroundColor: '#ffb701', padding: '10px 15px', color: '#000000', fontSize: '17px', fontWeight: '700', textAlign: 'center' }}>Unit Price</div>
          <div style={{ width: '25%', backgroundColor: '#ff76aa', padding: '10px 15px', color: '#000000', fontSize: '17px', fontWeight: '700', textAlign: 'center' }}>Amount</div>
        </div>

        {/* Table Rows */}
        <div style={{ backgroundColor: '#ffffff' }}>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #535457ff' }}>
              <div style={{ width: '12%', fontWeight: '500', padding: '12px 15px', color: '#374151', fontSize: '15px', textAlign: 'center' }}>{item.quantity}</div>
              <div style={{ width: '38%', fontWeight: '500', padding: '12px 15px', color: '#374151', fontSize: '15px' }}>{item.description}</div>
              <div style={{ width: '25%', fontWeight: '500', padding: '12px 15px', color: '#374151', fontSize: '15px', textAlign: 'center' }}>{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <div style={{ width: '25%', fontWeight: '500', padding: '12px 15px', color: '#374151', fontSize: '15px', textAlign: 'center' }}>{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TERMS, TOTALS, PAYMENT INFO Section */}
      <div style={{ position: 'absolute', top: '690px', left: '50%', transform: 'translateX(-50%)', width: '85%', display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Side - Terms & Payment Info */}
        <div style={{ width: '45%' }}>
          {/* Terms */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#000000', fontWeight: '700', fontSize: '16px', margin: '0 0 8px 0' }}>Terms & Conditions</p>
            {terms.map((term, index) => (
              <p key={index} style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 4px 0', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <span style={{ color: '#000000', fontSize: '14px', marginTop: '3px' }}>◆</span>
                <span style={{color: '#6b7280', fontSize: '14px'}}>{term}</span>
              </p>
            ))}
          </div>
          
          {/* Payment Info */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#000000', fontWeight: '700', fontSize: '16px', margin: '0 0 8px 0' }}>Payment Info</p>
            <p style={{ color: '#374151', fontSize: '14px', margin: '0 0 3px 0' }}><span style={{ fontWeight: '700' }}>Bank Name:</span> {bankName}</p>
            <p style={{ color: '#374151', fontSize: '14px', margin: '0 0 3px 0' }}><span style={{ fontWeight: '700' }}>Account No:</span> {accountNo}</p>
            <p style={{ color: '#374151', fontSize: '14px', margin: '0 0 3px 0' }}><span style={{ fontWeight: '700' }}>IFSC Code:</span> {ifscCode}</p>
          </div>
          
          {/* Signature */}
          <div>
            {signature ? (
              <img src={signature} alt="Signature" style={{ height: '40px', marginBottom: '5px' }} />
            ) : (
              <div style={{ height: '40px', width: '100px', marginBottom: '5px', borderBottom: '1px solid #9ca3af', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <span style={{ fontStyle: 'italic', color: '#9ca3af', fontSize: '16px', fontFamily: 'cursive', paddingBottom: '5px' }}>Sign</span>
              </div>
            )}
            <p style={{ color: '#000000', fontSize: '13px', fontWeight: '600', margin: '6px' }}>Authorised Sign</p>
          </div>
        </div>

        {/* Right Side - Totals & QR */}
        <div style={{ width: '45%' }}>
          {/* Totals */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#000000', fontSize: '15px', fontWeight: '700' }}>Sub Total</span>
              <span style={{ color: '#000000', fontSize: '15px' }}>{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#000000', fontSize: '15px', fontWeight: '700' }}>Tax</span>
              <span style={{ color: '#000000', fontSize: '15px' }}>{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
            </div>
            
            {/* Total Box */}
            <div style={{ backgroundColor: '#ffb701', padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#000000', fontWeight: '700', fontSize: '15px' }}>Total</span>
              <span style={{ color: '#000000', fontWeight: '700', fontSize: '16px' }}>{total.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
            </div>
          </div>
          
          {/* QR Code */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#000000', fontWeight: '700', fontSize: '14px', margin: '0 0 5px 0' }}>Scan To Pay</p>
            {qrCode ? (
              <img src={qrCode} alt="QR Code" style={{ width: '80px', height: '80px', display: 'block', margin: '0 auto' }} />
            ) : (
              <img src={qrCodeImg} alt="QR Code" style={{ width: '100px', height: '100px', display: 'block', margin: '0 auto' }} />
            )}
            <p style={{ color: '#000000', fontSize: '12px', margin: '8px 0 0 0', lineHeight: '1.4' }}>Dynamic QR Code will be<br />inserted here</p>
          </div>
        </div>
      </div>

      {/* FOOTER - Text only, background is in the image */}
      <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '15px 50px' }}>
        <p style={{ color: '#000000', fontWeight: '700', fontSize: '18px', textAlign: 'center', margin: '0 0 10px 0' }}>Thank for your business!</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#000000', fontSize: '13px' }}>{email}</span>
          <span style={{ color: '#000000', fontSize: '13px' }}>{website}</span>
          <span style={{ color: '#000000', fontSize: '13px' }}>{phone}</span>
        </div>
      </div>
    </div>
  );
};

export default Templates2;
