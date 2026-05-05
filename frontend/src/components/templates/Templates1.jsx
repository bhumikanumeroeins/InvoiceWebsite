import bgImage from "../../assets/templates/1_1.jpg";
import paymentBoxImg from "../../assets/templates/1_2.png";
import scanBoxImg from "../../assets/templates/1_3.png";
import qrCodeImg from "../../assets/templates/images (1).png";
import bracketImg from "../../assets/templates/1.jpg";
import { getInvoiceData } from "../../utils/invoiceDefaults";
import EditableText from "../shared/EditableText";
import LogoUpload from "../shared/LogoUpload";
import SignatureField from "../shared/SignatureField";
import QRUpload from "../shared/QRUpload";
import { getRawItems, getEditableRows, AddItemButton } from "../shared/templateHelpers";

const Templates1 = ({ data = {}, onFieldChange, readOnly = true }) => {
  const {
    logo,
    companyName,
    companyAddress,
    billToName,
    billToAddress,
    shipToName,
    shipToAddress,
    invoiceNumber,
    invoiceDate,
    poNumber,
    dueDate,
    items,
    terms,
    subtotal,
    taxAmount,
    total,
    bankName,
    accountNo,
    ifscCode,
    signature,
    qrCode,
    email,
    phone,
    website,
    currencySymbol,
  } = getInvoiceData(data);

  const f = (field) => (val) => onFieldChange && onFieldChange(field, val);
  const magenta = "#e91e8c";
  const darkBg = "#0d1021";

  const rawItems = [
    {
      desc: data.item1Desc ?? items[0]?.description ?? "",
      qty: data.item1Qty ?? String(items[0]?.quantity ?? ""),
      rate: data.item1Rate ?? String(items[0]?.rate ?? ""),
    },
    {
      desc: data.item2Desc ?? items[1]?.description ?? "",
      qty: data.item2Qty ?? String(items[1]?.quantity ?? ""),
      rate: data.item2Rate ?? String(items[1]?.rate ?? ""),
    },
    {
      desc: data.item3Desc ?? items[2]?.description ?? "",
      qty: data.item3Qty ?? String(items[2]?.quantity ?? ""),
      rate: data.item3Rate ?? String(items[2]?.rate ?? ""),
    },
    {
      desc: data.item4Desc ?? items[3]?.description ?? "",
      qty: data.item4Qty ?? String(items[3]?.quantity ?? ""),
      rate: data.item4Rate ?? String(items[3]?.rate ?? ""),
    },
  ];

  return (
    <>
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
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              padding: "95px 50px 30px",
              position: "relative",
              zIndex: 5,
            }}
          >
            {/* Logo */}
            <div style={{ marginBottom: "18px" }}>
              <LogoUpload
                logoImage={data.logoImage || logo}
                logoText="LOGO"
                onLogoChange={f("logoImage")}
                readOnly={readOnly}
                textStyle={{
                  color: magenta,
                  fontSize: "26px",
                  fontWeight: "700",
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: "2px",
                }}
              />
            </div>

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
                <EditableText
                  value={companyName}
                  onChange={f("businessName")}
                  readOnly={readOnly}
                />
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
                <EditableText
                  value={companyAddress}
                  onChange={f("businessAddress1")}
                  readOnly={readOnly}
                />
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div style={{ width: "170px" }}>
                <p style={{ fontWeight: 700 }}>BILL TO:</p>
                <p>
                  <EditableText
                    value={billToName}
                    onChange={f("clientName")}
                    readOnly={readOnly}
                  />
                </p>
                <p style={{ wordBreak: "break-word" }}>
                  <EditableText
                    value={billToAddress}
                    onChange={f("clientAddress1")}
                    readOnly={readOnly}
                  />
                </p>
              </div>
              <img
                src={bracketImg}
                alt=""
                style={{ height: "80px", margin: "0 10px" }}
              />
              <div style={{ width: "170px" }}>
                <p style={{ fontWeight: 700 }}>SHIP TO</p>
                <p>
                  <EditableText
                    value={shipToName}
                    onChange={f("shipToName")}
                    readOnly={readOnly}
                  />
                </p>
                <p style={{ wordBreak: "break-word" }}>
                  <EditableText
                    value={shipToAddress}
                    onChange={f("shipToAddress1")}
                    readOnly={readOnly}
                  />
                </p>
              </div>
              <img
                src={bracketImg}
                alt=""
                style={{ height: "80px", margin: "0 10px" }}
              />
              <div style={{ flex: 1 }}>
                {[
                  ["INVOICE#", invoiceNumber, "invoiceNumber"],
                  ["INVOICE DATE", invoiceDate, "invoiceDate"],
                  ["P.O#", poNumber, "poNumber"],
                  ["DUE DATE", dueDate, "dueDate"],
                ].map(([label, value, field]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <strong>{label}</strong>
                    <span>
                      <EditableText
                        value={value}
                        onChange={f(field)}
                        readOnly={readOnly}
                      />
                    </span>
                  </div>
                ))}
                  <AddItemButton rawItems={rawItems} onFieldChange={onFieldChange} />
              </div>
            </div>
          </div>

          {/* Items Table */}
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
            {readOnly
              ? items.map((item, index) => (
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
                      {currencySymbol}
                      {item.rate}
                    </div>
                    <div style={{ width: "25%", textAlign: "right" }}>
                      {currencySymbol}
                      {item.amount}
                    </div>
                  </div>
                ))
              : getEditableRows(rawItems).map((raw, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      padding: "8px 35px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div style={{ width: "12%" }}>
                      <EditableText
                        value={raw.qty}
                        onChange={f(`item${i + 1}Qty`)}
                        readOnly={false}
                        placeholder="1"
                      />
                    </div>
                    <div style={{ width: "38%" }}>
                      <EditableText
                        value={raw.desc}
                        onChange={f(`item${i + 1}Desc`)}
                        readOnly={false}
                        placeholder={`Item ${i + 1}`}
                      />
                    </div>
                    <div style={{ width: "25%", textAlign: "center" }}>
                      <EditableText
                        value={raw.rate}
                        onChange={f(`item${i + 1}Rate`)}
                        readOnly={false}
                        placeholder="0.00"
                      />
                    </div>
                    <div style={{ width: "25%", textAlign: "right" }}>
                      {currencySymbol}
                      {(
                        (parseFloat(raw.qty) || 1) * (parseFloat(raw.rate) || 0)
                      ).toFixed(2)}
                    </div>
                  </div>
                ))}
          </div>

          {/* Terms & Totals */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "40px 50px 0",
            }}
          >
            <div style={{ width: "45%" }}>
              <p style={{ fontWeight: 700 }}>TERMS AND CONDITIONS</p>
              <EditableText
                value={
                  Array.isArray(terms) ? terms.join(", ") : data.terms || ""
                }
                onChange={f("terms")}
                readOnly={readOnly}
                multiline
              />
            </div>
            <div style={{ width: "40%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>SUBTOTAL</strong>
                <span>
                  {currencySymbol}
                  {subtotal}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>
                  <EditableText
                    value={data.taxLabel || "TAX%"}
                    onChange={f("taxLabel")}
                    readOnly={readOnly}
                  />
                </strong>
                <span>
                  {currencySymbol}
                  {taxAmount}
                </span>
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
                <span style={{ color: "#fff" }}>
                  {currencySymbol}
                  {total}
                </span>
              </div>
            </div>
          </div>

          <div style={{ padding: "35px 50px 0" }}>
            <p style={{ fontWeight: 800 }}>THANK YOU FOR YOUR BUSINESS</p>
          </div>

          {/* Payment, Signature, QR */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              padding: "0px 50px",
              alignItems: "flex-end",
            }}
          >
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
                  <span style={{ color: "#71717a", width: "75px" }}>
                    Bank Name:
                  </span>
                  <span style={{ color: "#27272a", fontWeight: "600" }}>
                    <EditableText
                      value={bankName}
                      onChange={f("bankName")}
                      readOnly={readOnly}
                    />
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "2px",
                    fontSize: "10px",
                  }}
                >
                  <span style={{ color: "#71717a", width: "75px" }}>
                    Account No:
                  </span>
                  <span style={{ color: "#27272a", fontWeight: "600" }}>
                    <EditableText
                      value={accountNo}
                      onChange={f("accountNumber")}
                      readOnly={readOnly}
                    />
                  </span>
                </div>
                <div style={{ display: "flex", fontSize: "10px" }}>
                  <span style={{ color: "#71717a", width: "75px" }}>
                    IFSC Code:
                  </span>
                  <span style={{ color: "#27272a", fontWeight: "600" }}>
                    <EditableText
                      value={ifscCode}
                      onChange={f("ifscCode")}
                      readOnly={readOnly}
                    />
                  </span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, textAlign: "center", paddingBottom: "8px" }}>
              <SignatureField
                signatureImage={data.signatureImage}
                onSignatureChange={f("signatureImage")}
                readOnly={readOnly}
                lineWidth="90px"
              />
            </div>
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
                  <QRUpload
                    qrImage={data.qrCodeImage}
                    fallbackImage={qrCodeImg}
                    onQRChange={f("qrCodeImage")}
                    readOnly={readOnly}
                    label=""
                    size={90}
                  />
                </div>
              </div>
              <p
                style={{
                  color: "#27272a",
                  fontSize: "12px",
                  margin: "6px 0 0 0",
                  lineHeight: "1.3",
                }}
              >
                Dynamic QR Code will
                <br />
                be inserted here
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: "-150px",
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
              <p style={{ color: "#ffffff", fontSize: "14px", margin: 0 }}>
                <EditableText
                  value={email}
                  onChange={f("footerEmail")}
                  readOnly={readOnly}
                />
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
              <p style={{ color: "#ffffff", fontSize: "14px", margin: 0 }}>
                <EditableText
                  value={phone}
                  onChange={f("footerPhone")}
                  readOnly={readOnly}
                />
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
              <p style={{ color: "#ffffff", fontSize: "14px", margin: 0 }}>
                <EditableText
                  value={website}
                  onChange={f("footerWebsite")}
                  readOnly={readOnly}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "794px",
          textAlign: "center",
          padding: "8px 50px 4px",
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "#fff",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            color: "#9ca3af",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          This invoice has been generated electronically and is valid without
          signature.
        </p>
      </div>
    </>
  );
};

export default Templates1;