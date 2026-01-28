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
        fontFamily: "'Montserrat', sans-serif",
        overflow: 'hidden',
        backgroundColor: '#ffffff'
      }}
    >
      {/* BACKGROUND IMAGE */}
      <img
        src={bgImage}
        alt=""
        crossOrigin="anonymous"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '794px',
          height: '1123px',
          objectFit: 'cover',
          zIndex: 0
        }}
      />

      {/* CONTENT WRAPPER */}
      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* HEADER CONTENT */}
        <div style={{ padding: '45px 50px 30px', position: 'relative' }}>

          {/* Logo */}
          <div style={{ marginBottom: '18px' }}>
            {logo ? (
              <img
                src={logo}
                alt="Logo"
                crossOrigin="anonymous"
                style={{ height: '32px' }}
              />
            ) : (
              <span
                style={{
                  color: magenta,
                  fontSize: '26px',
                  fontWeight: '700',
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: '2px'
                }}
              >
                LOGO
              </span>
            )}
          </div>

          {/* INVOICE title */}
          <div style={{ position: 'absolute', top: '65px', right: '50px' }}>
            <span
              style={{
                color: magenta,
                fontSize: '28px',
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: '4px',
                fontWeight: '600'
              }}
            >
              INVOICE
            </span>
          </div>

          {/* Company Info */}
          <div style={{ marginBottom: '28px' }}>
            <p
              style={{
                color: '#000000',
                fontWeight: '700',
                fontSize: '14px',
                letterSpacing: '1px',
                margin: '0 0 4px 0',
                fontFamily: "'Orbitron', sans-serif",
                textTransform: 'uppercase'
              }}
            >
              {companyName}
            </p>
            <p
              style={{
                color: '#4b5563',
                fontSize: '14px',
                margin: 0,
                whiteSpace: 'pre-line',
                lineHeight: '1.5'
              }}
            >
              {companyAddress}
            </p>
          </div>

          {/* Bill / Ship / Details */}
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>

            {/* Bill To */}
            <div style={{ width: '170px' }}>
              <p style={{ fontWeight: 700, fontSize: '14px' }}>BILL TO:</p>
              <p>{billToName}</p>
              <p style={{ whiteSpace: 'pre-line' }}>{billToAddress}</p>
            </div>

            <img src={bracketImg} alt="" style={{ height: '80px', margin: '0 10px' }} />

            {/* Ship To */}
            <div style={{ width: '170px' }}>
              <p style={{ fontWeight: 700, fontSize: '14px' }}>SHIP TO</p>
              <p>{shipToName}</p>
              <p style={{ whiteSpace: 'pre-line' }}>{shipToAddress}</p>
            </div>

            <img src={bracketImg} alt="" style={{ height: '80px', margin: '0 10px' }} />

            {/* Invoice Details */}
            <div style={{ flex: 1 }}>
              {[
                ['INVOICE#', invoiceNumber],
                ['INVOICE DATE', invoiceDate],
                ['P.O#', poNumber],
                ['DUE DATE', dueDate],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
                >
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ITEMS */}
        <div style={{ padding: '0 50px', marginTop: '10px' }}>
          <div style={{ backgroundColor: '#ff0f7c', display: 'flex', padding: '14px 35px' }}>
            {['QTY', 'DESCRIPTION', 'UNIT PRICE', 'AMOUNT'].map((h, i) => (
              <div
                key={h}
                style={{
                  width: ['12%', '38%', '25%', '25%'][i],
                  color: '#fff',
                  fontWeight: 700
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {items.map((item, index) => (
            <div
              key={index}
              style={{ display: 'flex', padding: '16px 35px', borderBottom: '1px solid #eee' }}
            >
              <div style={{ width: '12%' }}>{item.quantity}</div>
              <div style={{ width: '38%' }}>{item.description}</div>
              <div style={{ width: '25%', textAlign: 'center' }}>{item.rate}</div>
              <div style={{ width: '25%', textAlign: 'right' }}>{item.amount}</div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div style={{ padding: '40px 50px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '40%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>SUBTOTAL</strong>
              <span>{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>TAX%</strong>
              <span>{taxAmount}</span>
            </div>

            <div
              style={{
                marginTop: '12px',
                backgroundColor: '#ff0f7c',
                padding: '12px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                borderRadius: '4px'
              }}
            >
              <strong style={{ color: '#fff' }}>TOTAL</strong>
              <span style={{ color: '#fff' }}>{total}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70px',
            padding: '10px 50px',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span>{email}</span>
          <span>{phone}</span>
          <span>{website}</span>
        </div>

      </div>
    </div>
  );
};

export default Template1;
