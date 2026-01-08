import bgImage from '../../assets/templates/1_1.jpg';
import paymentBoxImg from '../../assets/templates/1_2.png';
import scanBoxImg from '../../assets/templates/1_3.png';
import qrCodeImg from '../../assets/templates/images (1).png';
import bracketImg from '../../assets/templates/1.jpg';
import { getInvoiceData } from '../../utils/invoiceDefaults';

const Template1 = ({ data = {} }) => {
  const {
    logo, companyName, companyAddress, billToName, billToAddress,
    shipToName, shipToAddress, invoiceNumber, invoiceDate, poNumber,
    dueDate, items, terms, subtotal, taxAmount, total, bankName,
    accountNo, ifscCode, signature, qrCode, email, phone, website
  } = getInvoiceData(data);

  const magenta = '#e91e8c';
  const darkBg = '#0d1021';

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
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      {/* HEADER CONTENT */}
      <div style={{ padding: '45px 50px 30px', position: 'relative' }}>
        
        {/* Logo */}
        <div style={{ marginBottom: '18px' }}>
          {logo ? (
            <img src={logo} alt="Logo" style={{ height: '32px' }} />
          ) : (
            <span style={{ 
              color: magenta, 
              fontSize: '26px', 
              fontWeight: '700', 
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: '2px'
            }}>
              LOGO
            </span>
          )}
        </div>

        {/* INVOICE title */}
        <div style={{ position: 'absolute', top: '65px', right: '50px' }}>
          <span style={{ 
            color: magenta, 
            fontSize: '28px', 
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '4px',
            fontWeight: '400'
          }}>
            INVOICE
          </span>
        </div>

        {/* Company Info */}
        <div style={{ marginBottom: '28px' }}>
          <p style={{ 
            color: '#000000',
            fontWeight: '700', 
            fontSize: '13px', 
            letterSpacing: '1px', 
            margin: '0 0 4px 0',
            fontFamily: "'Orbitron', sans-serif"
          }}>{companyName}</p>
          <p style={{ 
            color: '#4b5563', 
            fontSize: '12px', 
            margin: 0, 
            whiteSpace: 'pre-line', 
            lineHeight: '1.5',
            fontFamily: "'Montserrat', sans-serif"
          }}>{companyAddress}</p>
        </div>

        {/* Bill To, Ship To, Invoice Details */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {/* Bill To */}
          <div style={{ width: '170px' }}>
            <p style={{ 
              color: '#000000', 
              fontWeight: '700', 
              fontSize: '13px', 
              letterSpacing: '1px', 
              margin: '0 0 4px 0',
              fontFamily: "'Orbitron', sans-serif"
            }}>BILL TO:</p>
            <p style={{ 
              color: '#4b5563', 
              fontSize: '12px', 
              margin: 0,
              lineHeight: '1.5',
              fontFamily: "'Montserrat', sans-serif"
            }}>{billToName}</p>
            <p style={{ 
              color: '#4b5563', 
              fontSize: '12px', 
              margin: 0, 
              whiteSpace: 'pre-line', 
              lineHeight: '1.5',
              fontFamily: "'Montserrat', sans-serif"
            }}>{billToAddress}</p>
          </div>

          {/* Pink Bracket Separator */}
          <img src={bracketImg} alt="Bracket" style={{ width: 'auto', height: '80px', margin: '0 10px', flexShrink: 0, objectFit: 'contain' }} />

          {/* Ship To */}
          <div style={{ width: '170px' }}>
            <p style={{ 
              color: '#000000', 
              fontWeight: '700', 
              fontSize: '13px', 
              letterSpacing: '1px', 
              margin: '0 0 4px 0',
              fontFamily: "'Orbitron', sans-serif"
            }}>SHIP TO</p>
            <p style={{ 
              color: '#4b5563', 
              fontSize: '12px', 
              margin: 0,
              lineHeight: '1.5',
              fontFamily: "'Montserrat', sans-serif"
            }}>{shipToName}</p>
            <p style={{ 
              color: '#4b5563', 
              fontSize: '12px', 
              margin: 0, 
              whiteSpace: 'pre-line', 
              lineHeight: '1.5',
              fontFamily: "'Montserrat', sans-serif"
            }}>{shipToAddress}</p>
          </div>

          {/* Pink Bracket Separator */}
          <img src={bracketImg} alt="Bracket" style={{ width: 'auto', height: '80px', margin: '0 10px', flexShrink: 0, objectFit: 'contain' }} />

          {/* Invoice Details */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#000000', fontWeight: '700', fontSize: '11px', letterSpacing: '1px', fontFamily: "'Orbitron', sans-serif" }}>INVOICE#</span>
              <span style={{ color: '#000000', fontSize: '11px', fontFamily: "'Montserrat', sans-serif" }}>{invoiceNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#000000', fontWeight: '700', fontSize: '11px', letterSpacing: '1px', fontFamily: "'Orbitron', sans-serif" }}>INVOICE DATE</span>
              <span style={{ color: '#000000', fontSize: '11px', fontFamily: "'Montserrat', sans-serif" }}>{invoiceDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#000000', fontWeight: '700', fontSize: '11px', letterSpacing: '1px', fontFamily: "'Orbitron', sans-serif" }}>P.O#</span>
              <span style={{ color: '#000000', fontSize: '11px', fontFamily: "'Montserrat', sans-serif" }}>{poNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#000000', fontWeight: '700', fontSize: '11px', letterSpacing: '1px', fontFamily: "'Orbitron', sans-serif" }}>DUE DATE</span>
              <span style={{ color: '#000000', fontSize: '11px', fontFamily: "'Montserrat', sans-serif" }}>{dueDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div style={{ padding: '0 50px', marginTop: '30px' }}>
        {/* Table Header */}
        <div style={{ backgroundColor:'#ff0f7c', display: 'flex', padding: '14px 35px', alignItems: 'center' }}>
          <div style={{ width: '12%', color: '#ffffff', fontSize: '10px', fontWeight: '600', letterSpacing: '2px', fontFamily: "'Orbitron', sans-serif" }}>QTY</div>
          <div style={{ width: '38%', color: '#ffffff', fontSize: '10px', fontWeight: '600', letterSpacing: '2px', fontFamily: "'Orbitron', sans-serif" }}>DESCRIPTION</div>
          <div style={{ width: '25%', color: '#ffffff', fontSize: '10px', fontWeight: '600', letterSpacing: '2px', textAlign: 'center', fontFamily: "'Orbitron', sans-serif" }}>UNIT PRICE</div>
          <div style={{ width: '25%', color: '#ffffff', fontSize: '10px', fontWeight: '600', letterSpacing: '2px', textAlign: 'right', fontFamily: "'Orbitron', sans-serif" }}>AMOUNT</div>
        </div>

        {/* Table Rows */}
        <div style={{ backgroundColor: '#ffffff' }}>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', padding: '16px 35px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
              <div style={{ width: '12%', color: '#52525b', fontSize: '13px', fontFamily: "'Montserrat', sans-serif" }}>{item.qty}</div>
              <div style={{ width: '38%', color: '#52525b', fontSize: '13px', fontFamily: "'Montserrat', sans-serif" }}>{item.description}</div>
              <div style={{ width: '25%', color: '#52525b', fontSize: '13px', textAlign: 'center', fontFamily: "'Montserrat', sans-serif" }}>{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <div style={{ width: '25%', color: '#52525b', fontSize: '13px', textAlign: 'right', fontFamily: "'Montserrat', sans-serif" }}>{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TERMS & TOTALS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '40px 50px 0' }}>
        {/* Terms */}
        <div style={{ width: '45%' }}>
          <p style={{ color: '#27272a', fontWeight: '700', fontSize: '13px', letterSpacing: '2px', margin: '4px', fontFamily: "'Orbitron', sans-serif" }}>TERMS AND CONDITIONS</p>
          {terms.map((term, index) => (
            <p key={index} style={{ color: '#71717a', fontSize: '11px', margin: '0 0 7px 0', display: 'flex', alignItems: 'flex-start', gap: '6px', fontFamily: "'Montserrat', sans-serif" }}>
              <span style={{ color: '#000000', fontSize: '10px', marginTop: '3px' }}>◆</span>
              <span style={{ color: '#52525b', fontSize: '12px'}}>{term}</span>
            </p>
          ))}
        </div>

        {/* Totals */}
        <div style={{ width: '40%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', marginTop: '25px' }}>
            <span style={{ color: '#27272a', letterSpacing: '2px', fontWeight: '700',fontSize: '12px', fontFamily: "'Orbitron', sans-serif" }}>SUBTOTAL</span>
            <span style={{ color: '#27272a', fontSize: '11px', fontWeight: '700', fontFamily: "'Montserrat', sans-serif" }}>{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ color: '#27272a', letterSpacing: '2px',fontWeight: '700', fontSize: '12px', fontFamily: "'Orbitron', sans-serif" }}>TAX%</span>
            <span style={{ color: '#27272a', fontSize: '11px', fontWeight: '700', fontFamily: "'Montserrat', sans-serif" }}>{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
          </div>
          
          {/* TOTAL with cut corners */}
          <div style={{
            backgroundColor: '#ff0f7c',
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
          }}>
            <span style={{ color: '#ffffff', fontWeight: '700', letterSpacing: '3px', fontSize: '10px', fontFamily: "'Orbitron', sans-serif" }}>TOTAL</span>
            <span style={{ color: '#ffffff', fontWeight: '500', fontSize: '16px', fontFamily: "'Montserrat', sans-serif" }}>{total.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>

      {/* THANK YOU */}
      <div style={{ padding: '35px 50px 0' }}>
        <p style={{ color: '#27272a', fontWeight: '700', fontSize: '12px', letterSpacing: '2px', margin: 0, fontFamily: "'Orbitron', sans-serif" }}>THANK YOU FOR YOUR BUSINESS</p>
      </div>

      {/* PAYMENT, SIGNATURE, QR */}
      <div style={{ display: 'flex', gap: '20px', padding: '30px 50px', alignItems: 'flex-end' }}>
        {/* Payment Info */}
        <div style={{ width: '220px', position: 'relative' }}>
          <img src={paymentBoxImg} alt="Payment Box" style={{ width: '100%', height: 'auto' }} />
          <p style={{ position: 'absolute', top: '20px', left: '12px', color: darkBg, fontWeight: '700', fontSize: '11px', letterSpacing: '1px', margin: 0, fontFamily: "'Orbitron', sans-serif" }}>PAYMENT INFORMATION</p>
          <div style={{ position: 'absolute', top: '45px', left: '12px', right: '12px' }}>
            <div style={{ display: 'flex', marginBottom: '2px', fontSize: '11px' }}>
              <span style={{ color: '#71717a', width: '75px', fontFamily: "'Montserrat', sans-serif" }}>Bank Name:</span>
              <span style={{ color: '#27272a', fontWeight: '600', fontFamily: "'Montserrat', sans-serif" }}>{bankName}</span>
            </div>
            <div style={{ display: 'flex', marginBottom: '2px', fontSize: '10px' }}>
              <span style={{ color: '#71717a', width: '75px', fontFamily: "'Montserrat', sans-serif" }}>Account No:</span>
              <span style={{ color: '#27272a', fontWeight: '600', fontFamily: "'Montserrat', sans-serif" }}>{accountNo}</span>
            </div>
            <div style={{ display: 'flex', fontSize: '10px', bottom:'12px' }}>
              <span style={{ color: '#71717a', width: '75px', fontFamily: "'Montserrat', sans-serif" }}>IFSC Code:</span>
              <span style={{ color: '#27272a', fontWeight: '600', fontFamily: "'Montserrat', sans-serif" }}>{ifscCode}</span>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div style={{ flex: 1, textAlign: 'center', paddingBottom: '8px' }}>
          {signature ? (
            <img src={signature} alt="Signature" style={{ height: '40px', marginBottom: '6px' }} />
          ) : (
            <div style={{ height: '40px', width: '90px', margin: '0 auto 6px', borderBottom: '2px solid #ff0f7c', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <span style={{ fontStyle: 'italic', color: '#a1a1aa', fontSize: '16px', fontFamily: 'cursive', paddingBottom: '5px' }}>Sign</span>
            </div>
          )}
          <p style={{ color: '#27272a', fontWeight:'700', fontSize: '13px', margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Authorised Sign</p>
        </div>

        {/* QR Code */}
        <div style={{ width: '160px', textAlign: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img src={scanBoxImg} alt="Scan Box" style={{ width: '100%', height: 'auto' }} />
            <p style={{ position: 'absolute', top: '20px', left: '55%', transform: 'translateX(-50%)', color: magenta, fontWeight: '800', fontSize: '11px', letterSpacing: '1px', margin: 0, fontFamily: "'Orbitron', sans-serif", whiteSpace: 'nowrap' }}>SCAN TO PAY</p>
            <div style={{ position: 'absolute', top: '42px', left: '50%', transform: 'translateX(-50%)' }}>
              {qrCode ? (
                <img src={qrCode} alt="QR Code" style={{ width: '75px', height: '75px' }} />
              ) : (
                <img src={qrCodeImg} alt="QR Code" style={{ width: '90px', height: '75px' }} />
              )}
            </div>
          </div>
          <p style={{ color: '#27272a', fontSize: '12px', margin: '6px 0 0 0', lineHeight: '1.3', fontFamily: "'Montserrat', sans-serif" }}>
            Dynamic QR Code will<br />be inserted here
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ position: 'absolute', bottom: '0', left: 0, right: 0, padding: '25px 50px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'left' }}>
          <p style={{ color: '#ffffff', fontWeight: '700', fontSize: '10px', letterSpacing: '2px', margin: '0 0 3px 0', fontFamily: "'Orbitron', sans-serif" }}>EMAIL</p>
          <p style={{ color: '#ffffff', fontSize: '10px', margin: 0, fontFamily: "'Montserrat', sans-serif" }}>{email}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#ffffff', fontWeight: '700', fontSize: '10px', letterSpacing: '2px', margin: '0 0 3px 0', fontFamily: "'Orbitron', sans-serif" }}>PHONE NO.</p>
          <p style={{ color: '#ffffff', fontSize: '10px', margin: 0, fontFamily: "'Montserrat', sans-serif" }}>{phone}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#ffffff', fontWeight: '700', fontSize: '10px', letterSpacing: '2px', margin: '0 0 3px 0', fontFamily: "'Orbitron', sans-serif" }}>WEBSITE</p>
          <p style={{ color: '#ffffff', fontSize: '10px', margin: 0, fontFamily: "'Montserrat', sans-serif" }}>{website}</p>
        </div>
      </div>
    </div>
  );
};

export default Template1;
