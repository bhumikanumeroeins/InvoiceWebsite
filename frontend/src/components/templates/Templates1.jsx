import bgImage from '../../assets/templates/1_1.jpg';
import paymentBoxImg from '../../assets/templates/1_2.png';
import scanBoxImg from '../../assets/templates/1_3.png';
import qrCodeImg from '../../assets/templates/images (1).png';
import bracketImg from '../../assets/templates/1.jpg';
import { getInvoiceData } from '../../utils/invoiceDefaults';

const Templates1 = ({ data = {} }) => {
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
        width: "794px",
        height: "1123px",
        position: "relative",
        fontFamily: "'Montserrat', sans-serif",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      {/* BACKGROUND IMAGE */}
      <img
        src={bgImage}
        alt=""
        crossOrigin="anonymous"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "794px",
          height: "1123px",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* CONTENT WRAPPER */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {/* HEADER CONTENT */}
        <div
          style={{
            padding: "95px 50px 30px",
            position: "relative",
            zIndex: 5,
          }}
        >
          {/* Logo */}
          <div style={{ marginBottom: "18px" }}>
            {logo ? (
              <img src={logo} alt="Logo" style={{ height: "100px" }} />
            ) : (
              <span
                style={{
                  color: magenta,
                  fontSize: "26px",
                  fontWeight: "700",
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: "2px",
                }}
              >
                LOGO
              </span>
            )}
          </div>

          {/* INVOICE title */}
          <div style={{ position: "absolute", top: "65px", right: "50px" }}>
            <span
              style={{
                color: magenta,
                fontSize: "28px",
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: "4px",
                fontWeight: "600",
              }}
            >
              INVOICE
            </span>
          </div>

          {/* Company Info */}
          <div style={{ marginBottom: "28px", maxWidth: "360px" }}>
            <p
              style={{
                color: "#000000",
                fontWeight: "700",
                fontSize: "14px",
                letterSpacing: "1px",
                margin: "0 0 4px 0",
                fontFamily: "'Orbitron', sans-serif",
                textTransform: "uppercase",
                wordBreak: "break-word",
              }}
            >
              {companyName}
            </p>
            <p
              style={{
                color: "#4b5563",
                fontSize: "14px",
                margin: 0,
                lineHeight: "1.5",
                wordBreak: "break-word",
              }}
            >
              {companyAddress}
            </p>
          </div>

          {/* Bill / Ship / Details */}
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            {/* Bill To */}
            <div style={{ width: "170px" }}>
              <p style={{ fontWeight: 700 }}>BILL TO:</p>
              <p>{billToName}</p>
              <p style={{ wordBreak: "break-word" }}>{billToAddress}</p>
            </div>

            <img
              src={bracketImg}
              alt=""
              style={{ height: "80px", margin: "0 10px" }}
            />

            {/* Ship To */}
            <div style={{ width: "170px" }}>
              <p style={{ fontWeight: 700 }}>SHIP TO</p>
              <p>{shipToName}</p>
              <p style={{ wordBreak: "break-word" }}>{shipToAddress}</p>
            </div>

            <img
              src={bracketImg}
              alt=""
              style={{ height: "80px", margin: "0 10px" }}
            />

            {/* Invoice Details */}
            <div style={{ flex: 1 }}>
              {[
                ["INVOICE#", invoiceNumber],
                ["INVOICE DATE", invoiceDate],
                ["P.O#", poNumber],
                ["DUE DATE", dueDate],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div style={{ padding: "0 50px", marginTop: "10px" }}>
          <div
            style={{
              backgroundColor: "#ff0f7c",
              display: "flex",
              padding: "14px 35px",
            }}
          >
            {["QTY", "DESCRIPTION", "UNIT PRICE", "AMOUNT"].map((h, i) => (
              <div
                key={h}
                style={{
                  width: ["12%", "38%", "25%", "25%"][i],
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                padding: "16px 35px",
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ width: "12%" }}>{item.quantity}</div>
              <div style={{ width: "38%" }}>{item.description}</div>
              <div style={{ width: "25%", textAlign: "center" }}>
                {item.rate}
              </div>
              <div style={{ width: "25%", textAlign: "right" }}>
                {item.amount}
              </div>
            </div>
          ))}
        </div>

        {/* TERMS & TOTALS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "40px 50px 0",
          }}
        >
          <div style={{ width: "45%" }}>
            <p style={{ fontWeight: 700 }}>TERMS AND CONDITIONS</p>
            {terms.map((term, index) => (
              <p key={index}>◆ {term}</p>
            ))}
          </div>

          <div style={{ width: "40%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>SUBTOTAL</strong>
              <span>{subtotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>TAX%</strong>
              <span>{taxAmount}</span>
            </div>

            <div
              style={{
                marginTop: "12px",
                backgroundColor: "#ff0f7c",
                padding: "12px 20px",
                display: "flex",
                justifyContent: "space-between",
                borderRadius: "4px",
              }}
            >
              <strong style={{ color: "#fff" }}>TOTAL</strong>
              <span style={{ color: "#fff" }}>{total}</span>
            </div>
          </div>
        </div>

        {/* THANK YOU */}
        <div style={{ padding: "35px 50px 0" }}>
          <p style={{ fontWeight: 800 }}>THANK YOU FOR YOUR BUSINESS</p>
        </div>

        {/* PAYMENT, SIGNATURE, QR */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            padding: "0px 50px",
            alignItems: "flex-end",
          }}
        >
          {/* Payment Info */}
          <div style={{ width: "220px", position: "relative" }}>
            <img
              src={paymentBoxImg}
              alt="Payment Box"
              style={{ width: "100%", height: "auto" }}
            />
            <p
              style={{
                position: "absolute",
                top: "20px",
                left: "12px",
                color: darkBg,
                fontWeight: "800",
                fontSize: "13px",
                letterSpacing: "1px",
                margin: 0,
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              PAYMENT INFORMATION
            </p>
            <div
              style={{
                position: "absolute",
                top: "45px",
                left: "12px",
                right: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  marginBottom: "2px",
                  fontSize: "11px",
                }}
              >
                <span
                  style={{
                    color: "#71717a",
                    width: "75px",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  Bank Name:
                </span>
                <span
                  style={{
                    color: "#27272a",
                    fontWeight: "600",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {bankName}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  marginBottom: "2px",
                  fontSize: "10px",
                }}
              >
                <span
                  style={{
                    color: "#71717a",
                    width: "75px",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  Account No:
                </span>
                <span
                  style={{
                    color: "#27272a",
                    fontWeight: "600",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {accountNo}
                </span>
              </div>
              <div
                style={{ display: "flex", fontSize: "10px", bottom: "12px" }}
              >
                <span
                  style={{
                    color: "#71717a",
                    width: "75px",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  IFSC Code:
                </span>
                <span
                  style={{
                    color: "#27272a",
                    fontWeight: "600",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {ifscCode}
                </span>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div style={{ flex: 1, textAlign: "center", paddingBottom: "8px" }}>
            {signature ? (
              <img
                src={signature}
                alt="Signature"
                style={{ height: "40px", marginBottom: "6px" }}
              />
            ) : (
              <div
                style={{
                  height: "40px",
                  width: "90px",
                  margin: "0 auto 6px",
                  borderBottom: "2px solid #ff0f7c",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontStyle: "italic",
                    color: "#a1a1aa",
                    fontSize: "16px",
                    fontFamily: "cursive",
                    paddingBottom: "5px",
                  }}
                >
                  Sign
                </span>
              </div>
            )}
            <p
              style={{
                color: "#27272a",
                fontWeight: "700",
                fontSize: "13px",
                margin: 0,
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Authorised Sign
            </p>
          </div>

          {/* QR Code */}
          <div style={{ width: "160px", textAlign: "center" }}>
            <div style={{ position: "relative" }}>
              <img
                src={scanBoxImg}
                alt="Scan Box"
                style={{ width: "100%", height: "auto" }}
              />
              <p
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "58%",
                  transform: "translateX(-50%)",
                  color: magenta,
                  fontWeight: "800",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  margin: 0,
                  fontFamily: "'Orbitron', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                SCAN TO PAY
              </p>
              <div
                style={{
                  position: "absolute",
                  top: "42px",
                  left: "77%",
                  transform: "translateX(-50%)",
                  width: "100%",
                }}
              >
                {qrCode ? (
                  <img
                    src={qrCode}
                    alt="QR Code"
                    style={{ width: "75px", height: "75px" }}
                  />
                ) : (
                  <img
                    src={qrCodeImg}
                    alt="QR Code"
                    style={{ width: "90px", height: "75px" }}
                  />
                )}
              </div>
            </div>
            <p
              style={{
                color: "#27272a",
                fontSize: "12px",
                margin: "6px 0 0 0",
                lineHeight: "1.3",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Dynamic QR Code will
              <br />
              be inserted here
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            position: "absolute",
            bottom: "-180px",
            left: 0,
            right: 0,
            padding: "10px 50px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <p
              style={{
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "14px",
                letterSpacing: "2px",
                margin: "0 0 3px 0",
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              EMAIL
            </p>
            <p
              style={{
                color: "#ffffff",
                fontSize: "14px",
                margin: 0,
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {email}
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "14px",
                letterSpacing: "2px",
                margin: "0 0 3px 0",
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              PHONE NO.
            </p>
            <p
              style={{
                color: "#ffffff",
                fontSize: "14px",
                margin: 0,
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {phone}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "14px",
                letterSpacing: "2px",
                margin: "0 0 3px 0",
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              WEBSITE
            </p>
            <p
              style={{
                color: "#ffffff",
                fontSize: "14px",
                margin: 0,
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {website}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates1;
