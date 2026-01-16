import bgImage from '../../assets/templates/3_1.png';
import qrCodeImg from '../../assets/templates/images (1).png';
import { getInvoiceData } from '../../utils/invoiceDefaults';

const Template3 = ({ data = {} }) => {
  const {
    logo, companyName, companyAddress, billToName, billToAddress,
    shipToName, shipToAddress, invoiceNumber, invoiceDate, poNumber,
    dueDate, items, terms, subtotal, taxAmount, total, bankName,
    accountNo, ifscCode, signature, qrCode, email, phone, website
  } = getInvoiceData(data);

  // Colors from the template
  const orange = '#f5a623';
  const navy = '#12498e';
  const coral = '#ff6b6b';
  const teal = '#2dd4bf';

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
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* HEADER */}
      <div style={{ padding: '35px 50px 0' }}>
        {/* Company Info - positioned next to background logo box */}
        <div style={{ marginLeft: '130px' }}>
          <h1 style={{ color: navy, fontSize: '28px', fontWeight: '700', margin: '0 0 2px 0', fontFamily: "'Syne', sans-serif" }}>LOGO</h1>
          <p style={{ color: navy, fontSize: '15px', fontWeight: '800', margin: '0 0 2px 0',fontFamily: "'Orbitron', sans-serif", }}>{companyName}</p>
          <p style={{ color: navy, fontSize: '14px', margin: 0, whiteSpace: 'pre-line', lineHeight: '1.4' }}>{companyAddress}</p>
        </div>
      </div>

      {/* INVOICE TO & SHIP TO */}
      <div style={{ padding: '50px 50px 0', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '45%' }}>
          <p style={{ color: navy, fontWeight: '800', fontSize: '15px', margin: '0 0 8px 0', fontFamily: "'Orbitron', sans-serif", }}>INVOICE TO</p>
          <p style={{ color: navy, fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{billToName}<br />{billToAddress.replace('\n', ' ')}</p>
        </div>
        <div style={{ width: '45%' }}>
          <p style={{ color: navy, fontWeight: '800', fontSize: '15px', margin: '0 0 8px 0', fontFamily: "'Orbitron', sans-serif", }}>Ship To</p>
          <p style={{ color: navy, fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{shipToName}<br />{shipToAddress.replace('\n', ' ')}</p>
        </div>
      </div>

      {/* Blue separator line */}
      <div style={{ padding: '25px 50px 0' }}>
        <div style={{ borderBottom: '2px solid ' + '#83e7c3' }}></div>
      </div>

      {/* INVOICE DETAILS */}
      <div style={{ padding: '20px 50px 0' }}>
        {/* Row 1: INVOICE# and P.O# */}
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <div style={{ display: 'flex', width: '50%' }}>
            <span style={{ color: coral, fontWeight: '600', fontSize: '15px', fontFamily: "'Orbitron', sans-serif", width: '100px' }}>INVOICE#</span>
            <span style={{ color: navy, fontSize: '15px' }}>{invoiceNumber}</span>
          </div>
          <div style={{ display: 'flex', width: '50%' }}>
            <span style={{ color: navy, fontWeight: '600',  fontSize: '15px', width: '80px' }}>P.O#</span>
            <span style={{ color: navy, fontSize: '15px' }}>{poNumber}</span>
          </div>
        </div>
        {/* Row 2: Invoice Date and Due Date */}
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '50%' }}>
            <span style={{ color: navy, fontWeight: '600', fontSize: '15px', width: '100px' }}>Invoice Date</span>
            <span style={{ color: navy, fontSize: '15px' }}>{invoiceDate}</span>
          </div>
          <div style={{ display: 'flex', width: '50%' }}>
            <span style={{ color: navy, fontWeight: '600', fontSize: '15px', width: '80px' }}>Due Date</span>
            <span style={{ color: navy, fontSize: '15px' }}>{dueDate}</span>
          </div>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div style={{ padding: '25px 50px 0' }}>
        {/* Table Header - light skin/cream background */}
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#feffeb', padding: '12px 15px' }}>
          <div style={{ width: '10%', color: navy, fontSize: '15px', fontWeight: '800', fontFamily: "'Orbitron', sans-serif" }}>Qty</div>
          <div style={{ width: '40%', color: navy, fontSize: '15px', fontWeight: '800', fontFamily: "'Orbitron', sans-serif" }}>Description</div>
          <div style={{ width: '25%', color: navy, fontSize: '15px', fontWeight: '800', textAlign: 'center', fontFamily: "'Orbitron', sans-serif" }}>Unit Price</div>
          <div style={{ width: '25%', color: navy, fontSize: '15px', fontWeight: '800', textAlign: 'right', fontFamily: "'Orbitron', sans-serif" }}>Total</div>
        </div>

        {/* Table Rows - light skin/cream background with gap from header */}
        <div style={{ backgroundColor: '#feffeb', marginTop: '10px' }}>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '15px 15px' }}>
              <div style={{ width: '10%', color: navy, fontSize: '14px' }}>{item.qty}</div>
              <div style={{ width: '40%', color: navy, fontSize: '14px' }}>{item.description}</div>
              <div style={{ width: '25%', color: navy, fontSize: '14px', textAlign: 'center' }}>{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <div style={{ width: '25%', color: navy, fontSize: '14px', textAlign: 'right' }}>{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TERMS, TOTALS, PAYMENT Section */}
      <div style={{ padding: '30px 50px 0', display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Side */}
        <div style={{ width: '45%' }}>
          {/* Terms */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: navy, fontWeight: '900', fontSize: '16px', margin: '0 0 8px 0', fontFamily: "'Orbitron', sans-serif" }}>Terms and Conditions</p>
            {terms.map((term, index) => (
              <p key={index} style={{ color: coral, fontSize: '14px', margin: '0 0 3px 0', lineHeight: '1.5' }}>{term}</p>
            ))}
          </div>
          
          {/* Payment Info */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: navy, fontWeight: '900', fontSize: '16px', margin: '0 0 8px 0', fontFamily: "'Orbitron', sans-serif" }}>Payment Info</p>
            <p style={{ color: '#000000', fontSize: '14px', margin: '0 0 3px 0' }}><span style={{ fontWeight: '600' }}>Bank Info:</span> <span style={{ color: coral }}>{bankName}</span></p>
            <p style={{ color: '#000000', fontSize: '14px', margin: '0 0 3px 0' }}><span style={{ fontWeight: '600' }}>Account No:</span> <span style={{ color: coral }}>{accountNo}</span></p>
            <p style={{ color: '#000000', fontSize: '14px', margin: 0 }}><span style={{ fontWeight: '600' }}>IFSC Code:</span> <span style={{ color: coral }}>{ifscCode}</span></p>
          </div>
          
          {/* Signature */}
          <div>
            {signature ? (
              <img src={signature} alt="Signature" style={{ height: '40px', marginBottom: '5px' }} />
            ) : (
              <div style={{ height: '35px', width: '115px', marginBottom: '5px', borderBottom: '2px solid #12498e', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <span style={{ fontStyle: 'italic', color: '#9ca3af', fontSize: '14px', fontFamily: 'cursive', paddingBottom: '3px' }}>Sign</span>
              </div>
            )}
            <p style={{ color: navy, fontSize: '13px', fontWeight: '900', margin: 0, fontFamily: "'Orbitron', sans-serif" }}>Authorised Sign</p>
          </div>
        </div>

        {/* Right Side */}
        <div style={{ width: '45%' }}>
          {/* Totals */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: navy, fontSize: '16px' }}>Sub Total</span>
              <span style={{ color: coral, fontSize: '16px', fontWeight: '700' }}>{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: navy, fontSize: '16px' }}>Tax</span>
              <span style={{ color: coral, fontSize: '16px', fontWeight: '700' }}>{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
            </div>
            
            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fef3e2', padding: '10px 15px' }}>
              <span style={{ color: navy, fontWeight: '900', fontSize: '20px',  fontFamily: "'Syne', sans-serif" , letterSpacing: '2px' }}>TOTAL</span>
              <span style={{ color: coral, fontWeight: '700', fontSize: '18px' }}>{total.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
            </div>
          </div>
          
          {/* QR Code Box */}
          <div style={{ backgroundColor: '#fef3e2', padding: '10px', textAlign: 'center' }}>
            <p style={{ color: navy, fontWeight: '700', fontSize: '13px', margin: '0 0 10px 0', fontFamily: "'Orbitron', sans-serif" }}>Scan To Pay</p>
            {qrCode ? (
              <img src={qrCode} alt="QR Code" style={{ width: '70px', height: '70px', display: 'block', margin: '0 auto' }} />
            ) : (
              <img src={qrCodeImg} alt="QR Code" style={{ width: '70px', height: '70px', display: 'block', margin: '0 auto' }} />
            )}
            <p style={{ color: coral, fontSize: '11px', margin: '8px 0 0 0', lineHeight: '1.4' }}>Dynamic QR Code will<br />be inserted here</p>
          </div>
        </div>
      </div>

      {/* FOOTER - positioned above the colorful graphics */}
      <div style={{ position: 'absolute', bottom: '160px', left: '50px', right: '50px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: coral, fontSize: '14px', fontWeight: '700' }}>{website}</span>
        <span style={{ color: coral, fontSize: '14px', fontWeight: '700' }}>{email}, {phone}</span>
      </div>
    </div>
  );
};

export default Template3;
