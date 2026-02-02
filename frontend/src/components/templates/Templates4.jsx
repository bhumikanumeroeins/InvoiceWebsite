import bgImage from '../../assets/templates/4_1.jpg';
import qrCodeImg from '../../assets/templates/images (1).png';
import { getInvoiceData } from '../../utils/invoiceDefaults';

const Templates4 = ({ data = {} }) => {
  const {
    companyName, companyAddress, billToName, billToAddress,
    shipToName, shipToAddress, invoiceNumber, invoiceDate, poNumber,
    dueDate, items, terms, subtotal, taxAmount, total, bankName,
    accountNo, ifscCode, signature, qrCode, email, phone, website
  } = getInvoiceData(data);

  const pink = '#be549f';
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
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* LOGO & Company Info */}
      <div style={{ padding: '110px 50px 0', marginLeft: '100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
          {/* Rotated square with arrow icon */}
          <div style={{ width: '32px', height: '32px', border: '4px solid #374151', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ transform: 'rotate(-45deg)', fontSize: '14px', color: '#374151' }}>⌂</div>
          </div>
          <span style={{ color: gray, fontSize: '30px', fontWeight: '700' }}>LOGO</span>
        </div>
        <p style={{ color: gray, fontSize: '15px', fontWeight: '700', margin: '0 0 5px 0' }}>{companyName}</p>
        <p style={{ color: '#6b7280', fontSize: '13px', margin: 0, whiteSpace: 'pre-line', lineHeight: '1.6' }}>{companyAddress}</p>
      </div>

      {/* Invoice Details - Right side */}
      <div style={{ position: 'absolute', top: '110px', right: '50px' }}>
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <span style={{ color: gray, fontSize: '13px', fontWeight: '700', width: '110px' }}>Invoice#</span>
          <span style={{ color: '#6b7280', fontSize: '13px' }}>{invoiceNumber}</span>
        </div>
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <span style={{ color: gray, fontSize: '13px', fontWeight: '700', width: '110px' }}>Invoice Date</span>
          <span style={{ color: '#6b7280', fontSize: '13px' }}>{invoiceDate}</span>
        </div>
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <span style={{ color: gray, fontSize: '13px', fontWeight: '700', width: '110px' }}>P.O#</span>
          <span style={{ color: '#6b7280', fontSize: '13px' }}>{poNumber}</span>
        </div>
        <div style={{ display: 'flex' }}>
          <span style={{ color: gray, fontSize: '13px', fontWeight: '700', width: '110px' }}>Due Date</span>
          <span style={{ color: '#6b7280', fontSize: '13px' }}>{dueDate}</span>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div style={{ padding: '50px 50px 0' }}>
        {/* Table Header */}
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px' }}>
          <div style={{ width: '10%', color: pink, fontSize: '14px', fontWeight: '700', textTransform: 'uppercase' }}>Qty</div>
          <div style={{ width: '45%', color: pink, fontSize: '14px', fontWeight: '700', textTransform: 'uppercase' }}>Description</div>
          <div style={{ width: '22%', color: pink, fontSize: '14px', fontWeight: '700', textAlign: 'center', textTransform: 'uppercase' }}>Unit Price</div>
          <div style={{ width: '23%', color: pink, fontSize: '14px', fontWeight: '700', textAlign: 'right', textTransform: 'uppercase' }}>Amount</div>
        </div>

        {/* Table Rows */}
        <div>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '18px 0', borderBottom: '1px solid #6b7280' }}>
              <div style={{ width: '10%', color: gray, fontSize: '14px' }}>{item.quantity}</div>
              <div style={{ width: '45%', color: gray, fontSize: '14px' }}>{item.description}</div>
              <div style={{ width: '22%', color: gray, fontSize: '14px', textAlign: 'center' }}>{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <div style={{ width: '23%', color: gray, fontSize: '14px', textAlign: 'right' }}>{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BILL TO, SHIP TO & TOTALS */}
      <div style={{ padding: '35px 50px 0', display: 'flex', justifyContent: 'space-between' }}>
        {/* Bill To */}
        <div style={{ width: '28%' }}>
          <p style={{ color: pink, fontWeight: '600', fontSize: '16px', margin: '0 0 8px 0' }}>Bill To</p>
          <p style={{ color: gray, fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{billToName}<br />{billToAddress.replace('\n', ' ')}</p>
        </div>
        {/* Ship To */}
        <div style={{ width: '28%' }}>
          <p style={{ color: pink, fontWeight: '600', fontSize: '16px', margin: '0 0 8px 0' }}>Ship To</p>
          <p style={{ color: gray, fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{shipToName}<br />{shipToAddress.replace('\n', ' ')}</p>
        </div>
        {/* Totals */}
        <div style={{ width: '35%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: gray, fontSize: '16px', fontWeight: '800' }}>Sub Total:</span>
            <span style={{ color: gray, fontSize: '14px', fontWeight: '800' }}>{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: gray, fontSize: '16px', fontWeight: '800' }}>Tax:</span>
            <span style={{ color: gray, fontSize: '14px', fontWeight: '800' }}>{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
          </div>
          <div style={{ borderTop: '2px solid #374151', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: gray, fontSize: '16px', fontWeight: '800' }}>Total:</span>
            <span style={{ color: gray, fontSize: '14px', fontWeight: '800' }}>{total.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>

      {/* TERMS, PAYMENT & QR CODE */}
      <div style={{ padding: '35px 50px 0', display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Side - Terms & Payment */}
        <div style={{ width: '55%' }}>
          {/* Terms */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: pink, fontWeight: '600', fontSize: '16px', margin: '0 0 8px 0' }}>Terms and Conditions</p>
            {terms.map((term, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '3px' }}>
                <span style={{ color: pink, fontSize: '14px', marginTop: '4px' }}>■</span>
                <span style={{ color: gray, fontSize: '14px', lineHeight: '1.5' }}>{term}</span>
              </div>
            ))}
          </div>
          
          {/* Payment Info */}
          <div>
            <p style={{ color: pink, fontWeight: '600', fontSize: '16px', margin: '0 0 8px 0' }}>Payment Info</p>
            <p style={{ color: gray, fontSize: '14px', margin: '0 0 3px 0' }}><span style={{ fontWeight: '600' }}>Bank Name:</span> {bankName}</p>
            <p style={{ color: gray, fontSize: '14px', margin: '0 0 3px 0' }}><span style={{ fontWeight: '600' }}>Account No:</span> {accountNo}</p>
            <p style={{ color: gray, fontSize: '14px', margin: 0 }}><span style={{ fontWeight: '600' }}>IFSC Code:</span> {ifscCode}</p>
          </div>
        </div>

        {/* Right Side - QR Code */}
        <div style={{ width: '40%' }}>
          <div style={{ backgroundColor: pink, padding: '15px', textAlign: 'center' }}>
            <p style={{ color: '#fff', fontWeight: '600', fontSize: '15px', margin: '0 0 10px 0' }}>Scan To Pay</p>
            {qrCode ? (
              <img src={qrCode} alt="QR Code" style={{ width: '80px', height: '80px', display: 'block', margin: '0 auto', backgroundColor: '#fff', padding: '5px' }} />
            ) : (
              <img src={qrCodeImg} alt="QR Code" style={{ width: '90px', height: '90px', display: 'block', margin: '0 auto', backgroundColor: '#fff', padding: '5px' }} />
            )}
            <p style={{ color: '#fff', fontSize: '11px', margin: '8px 0 0 0', lineHeight: '1.4' }}>Dynamic QR Code will be<br />inserted here</p>
          </div>
          
          {/* Signature */}
          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            {signature ? (
              <img src={signature} alt="Signature" style={{ height: '40px', marginBottom: '5px' }} />
            ) : (
              <div style={{ height: '40px', marginBottom: '5px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <span style={{ fontStyle: 'italic', color: '#9ca3af', fontSize: '18px', fontFamily: 'cursive' }}>Sign</span>
              </div>
            )}
            <div style={{ borderTop: '2px solid #374151', width: '120px', margin: '0 auto 5px' }}></div>
            <p style={{ color: gray, fontSize: '14px', fontWeight: '600', margin: 0 }}>Authorised Sign</p>
          </div>
        </div>
      </div>

      {/* Thank you message & Footer - same row */}
      <div style={{ padding: '0px 50px 0' }}>
        <p style={{ color: gray, fontSize: '16px', fontWeight: '600', margin: '0 0 25px 0' }}>Thank you for your business</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: gray, fontSize: '13px' }}>{email}</span>
          <span style={{ color: gray, fontSize: '13px' }}>|</span>
          <span style={{ color: gray, fontSize: '13px' }}>{phone}</span>
          <span style={{ color: gray, fontSize: '13px' }}>|</span>
          <span style={{ color: gray, fontSize: '13px' }}>{website}</span>
        </div>
      </div>
    </div>
  );
};

export default Templates4;
