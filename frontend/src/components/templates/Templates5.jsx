import bgImage from '../../assets/templates/5_1.jpg';
import qrCodeImg from '../../assets/templates/images (1).png';
import { getInvoiceData } from '../../utils/invoiceDefaults';

const Templates5 = ({ data = {} }) => {
  const {
    companyName, companyAddress, billToName, billToAddress,
    shipToName, shipToAddress, invoiceNumber, invoiceDate, poNumber,
    dueDate, items, terms, subtotal, taxAmount, total, bankName,
    accountNo, ifscCode, signature, qrCode, email, phone, website
  } = getInvoiceData(data);

  const purple = '#33265d';
  const orange = '#fec62f';
  const gray = '#374151';

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
        fontFamily: "'Albert Sans', sans-serif",
      }}
    >
      {/* HEADER - Purple section */}
      <div style={{ padding: '38px 100px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left - Logo & Company */}
        <div>
          <p style={{ color: '#fff', fontSize: '28px', fontWeight: '400', margin: '0 0 0 0', fontFamily: "'Albert Sans', sans-serif" }}>LOGO</p>
          <p style={{ color: orange, fontSize: '32px', fontWeight: '400', margin: '0 0 0 0', fontFamily: "'Passion One', cursive" }}>{companyName}</p>
          <p style={{ color: '#fff', fontSize: '14px', margin: 0, whiteSpace: 'pre-line', lineHeight: '1.6' }}>{companyAddress}</p>
        </div>

        {/* Right - Bill To & Ship To */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#fff', fontSize: '14px', fontWeight: '800', margin: '0 0 5px 0' }}>Bill To</p>
            <p style={{ color: '#fff', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{billToName}<br />{billToAddress.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</p>
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: '14px', fontWeight: '800', margin: '0 0 5px 0' }}>Ship To</p>
            <p style={{ color: '#fff', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{shipToName}<br />{shipToAddress.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</p>
          </div>
        </div>
      </div>

      {/* INVOICE DETAILS & INVOICE text */}
      <div style={{ padding: '25px 80px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {/* Left - Invoice Details */}
        <div>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <span style={{ color: purple, fontSize: '16px', fontWeight: '600', width: '100px' }}>Invoice#:</span>
            <span style={{ color: gray, fontSize: '16px' }}>{invoiceNumber}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <span style={{ color: purple, fontSize: '16px', fontWeight: '600', width: '100px' }}>Invoice Date:</span>
            <span style={{ color: gray, fontSize: '16px' }}>{invoiceDate}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <span style={{ color: purple, fontSize: '16px', fontWeight: '600', width: '100px' }}>P.O#:</span>
            <span style={{ color: gray, fontSize: '16px' }}>{poNumber}</span>
          </div>
          <div style={{ display: 'flex' }}>
            <span style={{ color: purple, fontSize: '16px', fontWeight: '600', width: '100px' }}>Due Date:</span>
            <span style={{ color: gray, fontSize: '16px' }}>{dueDate}</span>
          </div>
        </div>

        {/* Right - INVOICE text */}
        <div>
          <p style={{ color: '#b374fe', fontSize: '50px', fontWeight: '400', margin: 0, fontFamily: "'Passion One', cursive", letterSpacing: '1px' }}>INVOICE</p>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div style={{ padding: '30px 80px 0' }}>
        {/* Table Header - light purple background with rounded corners */}
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1e4fe', padding: '12px 15px', borderRadius: '25px' }}>
          <div style={{ width: '10%', color: purple, fontSize: '17px', fontWeight: '500', fontFamily: "'Passion One', cursive" }}>Qty</div>
          <div style={{ width: '45%', color: purple, fontSize: '17px', fontWeight: '500', fontFamily: "'Passion One', cursive" }}>Description</div>
          <div style={{ width: '22%', color: purple, fontSize: '17px', fontWeight: '500', textAlign: 'center',fontFamily: "'Passion One', cursive" }}>Unit Price</div>
          <div style={{ width: '23%', color: purple, fontSize: '17px', fontWeight: '500', textAlign: 'right', fontFamily: "'Passion One', cursive" }}>Amount</div>
        </div>

        {/* Table Rows - alternating light purple and white with rounded corners */}
        <div>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '15px 15px', backgroundColor: index % 2 === 0 ? '#fff' : '#f1e4fe', borderRadius: index % 2 === 0 ? '0' : '25px', marginTop: '5px' }}>
              <div style={{ width: '10%', color: purple, fontSize: '15px', fontFamily: "'Passion One', cursive" }}>{item.quantity}</div>
              <div style={{ width: '45%', color: purple, fontSize: '15px' }}>{item.description}</div>
              <div style={{ width: '22%', color: purple, fontSize: '15px', textAlign: 'center' }}>{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <div style={{ width: '23%', color: purple, fontSize: '15px', textAlign: 'right' }}>{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TERMS & TOTALS */}
      <div style={{ padding: '25px 80px 0', display: 'flex', justifyContent: 'space-between' }}>
        {/* Left - Terms */}
        <div style={{ width: '40%' }}>
          <p style={{ color: gray, fontWeight: '700', fontSize: '16px', margin: '0 0 10px 0' }}>Terms and Conditions</p>
          {terms.map((term, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '3px' }}>
              <span style={{ color: orange, fontSize: '14px', marginTop: '3px' }}>◆</span>
              <span style={{ color: gray, fontSize: '14px', lineHeight: '1.5' }}>{term}</span>
            </div>
          ))}
        </div>

        {/* Right - Totals */}
        <div style={{ width: '40%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: gray, fontSize: '15px', fontWeight: '600' }}>Sub total</span>
            <span style={{ color: gray, fontSize: '15px' }}>{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: gray, fontSize: '15px', fontWeight: '600' }}>Tax</span>
            <span style={{ color: gray, fontSize: '15px' }}>{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: gray, fontSize: '15px', fontWeight: '700' }}>Total</span>
            <span style={{ color: gray, fontSize: '15px', fontWeight: '700' }}>{total.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>

      {/* PAYMENT INFO & QR CODE */}
      <div style={{ padding: '15px 80px 0', display: 'flex', justifyContent: 'space-between' }}>
        {/* Left - Payment Info */}
        <div style={{ width: '50%' }}>
          <p style={{ color: gray, fontWeight: '700', fontSize: '13px', margin: '0 0 10px 0' }}>Payment Info</p>
          <p style={{ color: gray, fontSize: '11px', margin: '0 0 3px 0' }}><span style={{ fontWeight: '600' }}>Bank Name:</span> {bankName}</p>
          <p style={{ color: gray, fontSize: '11px', margin: '0 0 3px 0' }}><span style={{ fontWeight: '600' }}>Account No:</span> {accountNo}</p>
          <p style={{ color: gray, fontSize: '11px', margin: 0 }}><span style={{ fontWeight: '600' }}>IFSC Code:</span> {ifscCode}</p>
        </div>

        {/* Right - QR Code & Signature */}
        <div style={{ width: '70%', textAlign: 'center' }}>
          <p style={{ color: gray, fontWeight: '600', fontSize: '13px', margin: '0 0 0 0' }}>Scan to Pay</p>
          {qrCode ? (
            <img src={qrCode} alt="QR Code" style={{ width: '80px', height: '80px', display: 'block', margin: '0 auto' }} />
          ) : (
            <img src={qrCodeImg} alt="QR Code" style={{ width: '80px', height: '80px', display: 'block', margin: '0 auto' }} />
          )}
          <p style={{ color: gray, fontSize: '10px', margin: '8px 0 0 0', lineHeight: '1.4' }}>Dynamic QR Code will<br />be inserted here</p>
          
          {/* Signature */}
          <div style={{ marginTop: '10px' }}>
            {signature ? (
              <img src={signature} alt="Signature" style={{ height: '35px', marginBottom: '5px' }} />
            ) : (
              <div style={{ height: '35px', marginBottom: '5px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <span style={{ fontStyle: 'italic', color: '#9ca3af', fontSize: '16px', fontFamily: 'cursive' }}>Sign</span>
              </div>
            )}
            <div style={{ borderTop: '1px solid #374151', width: '120px', margin: '0 auto 5px' }}></div>
            <p style={{ color: purple, fontSize: '12px', fontWeight: '600', margin: 0 }}>Authorised Sign</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ position: 'absolute', bottom: '45px', left: '80px', right: '80px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontSize: '11px' }}>{email}</span>
        <span style={{ color: '#fff', fontSize: '11px' }}>{phone}</span>
        <span style={{ color: '#fff', fontSize: '11px' }}>{website}</span>
      </div>
    </div>
  );
};

export default Templates5;
