import bgImage from "../../assets/templates/3_1.png";
import qrCodeImg from "../../assets/templates/images (1).png";
import { getInvoiceData } from "../../utils/invoiceDefaults";
import EditableText from "../shared/EditableText";
import LogoUpload from "../shared/LogoUpload";
import {
  getRawItems,
  getEditableRows,
  AddItemButton,
} from "../shared/templateHelpers";

const DEFAULT_VIS = {
  logoSection: true,
  businessInfo: true,
  clientInfo: true,
  shipTo: true,
  invoiceMeta: true,
  itemsTable: true,
  totals: true,
  terms: true,
  paymentInfo: true,
  signature: true,
  qrCodeSection: true,
};

const Templates3 = ({
  data = {},
  onFieldChange,
  readOnly = true,
  visibility = DEFAULT_VIS,
}) => {
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
  const vis = { ...DEFAULT_VIS, ...visibility };
  const paymentType = data.paymentInfoType || "bank";
  const rawItems = getRawItems(data, items);
  const navy = "#12498e",
    coral = "#ff6b6b";

  return (
    <>
      <div
        style={{
          width: "794px",
          height: "1123px",
          position: "relative",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "794px 1123px",
          backgroundPosition: "top left",
          backgroundRepeat: "no-repeat",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ padding: "35px 50px 0" }}>
          <div style={{ marginLeft: "130px" }}>
            <LogoUpload
              logoImage={data.logoImage || logo}
              logoText="LOGO"
              onLogoChange={f("logoImage")}
              readOnly={readOnly}
              textStyle={{
                color: navy,
                fontSize: "28px",
                fontWeight: "700",
                fontFamily: "'Syne', sans-serif",
              }}
            />
            <p
              style={{
                color: navy,
                fontSize: "15px",
                fontWeight: "800",
                margin: "0 0 2px 0",
                fontFamily: "'Orbitron', sans-serif",
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
                color: navy,
                fontSize: "14px",
                margin: 0,
                whiteSpace: "pre-line",
              }}
            >
              <EditableText
                value={companyAddress}
                onChange={f("businessAddress1")}
                readOnly={readOnly}
              />
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "50px 50px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "45%" }}>
            <p
              style={{
                color: navy,
                fontWeight: "800",
                fontSize: "15px",
                margin: "0 0 8px 0",
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              INVOICE TO
            </p>
            <p style={{ color: navy, fontSize: "14px", margin: 0 }}>
              <EditableText
                value={billToName}
                onChange={f("clientName")}
                readOnly={readOnly}
              />
            </p>
            <p style={{ color: navy, fontSize: "14px", margin: 0 }}>
              <EditableText
                value={billToAddress}
                onChange={f("clientAddress1")}
                readOnly={readOnly}
              />
            </p>
          </div>
          <div style={{ width: "45%" }}>
            <p
              style={{
                color: navy,
                fontWeight: "800",
                fontSize: "15px",
                margin: "0 0 8px 0",
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              Ship To
            </p>
            <p style={{ color: navy, fontSize: "14px", margin: 0 }}>
              <EditableText
                value={shipToName}
                onChange={f("shipToName")}
                readOnly={readOnly}
              />
            </p>
            <p style={{ color: navy, fontSize: "14px", margin: 0 }}>
              <EditableText
                value={shipToAddress}
                onChange={f("shipToAddress1")}
                readOnly={readOnly}
              />
            </p>
          </div>
        </div>

        <div style={{ padding: "25px 50px 0" }}>
          <div style={{ borderBottom: "2px solid #83e7c3" }}></div>
        </div>

        <div style={{ padding: "20px 50px 0" }}>
          <div style={{ display: "flex", marginBottom: "8px" }}>
            <div style={{ display: "flex", width: "50%" }}>
              <span
                style={{
                  color: coral,
                  fontWeight: "600",
                  fontSize: "15px",
                  fontFamily: "'Orbitron', sans-serif",
                  width: "100px",
                }}
              >
                INVOICE#
              </span>
              <EditableText
                value={invoiceNumber}
                onChange={f("invoiceNumber")}
                readOnly={readOnly}
              />
            </div>
            <div style={{ display: "flex", width: "50%" }}>
              <span
                style={{
                  color: navy,
                  fontWeight: "600",
                  fontSize: "15px",
                  width: "80px",
                }}
              >
                P.O#
              </span>
              <EditableText
                value={poNumber}
                onChange={f("poNumber")}
                readOnly={readOnly}
              />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", width: "50%" }}>
              <span
                style={{
                  color: navy,
                  fontWeight: "600",
                  fontSize: "15px",
                  width: "100px",
                }}
              >
                Invoice Date
              </span>
              <EditableText
                value={invoiceDate}
                onChange={f("invoiceDate")}
                readOnly={readOnly}
              />
            </div>
            <div style={{ display: "flex", width: "50%" }}>
              <span
                style={{
                  color: navy,
                  fontWeight: "600",
                  fontSize: "15px",
                  width: "80px",
                }}
              >
                Due Date
              </span>
              <EditableText
                value={dueDate}
                onChange={f("dueDate")}
                readOnly={readOnly}
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div style={{ padding: "25px 50px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#feffeb",
              padding: "12px 15px",
            }}
          >
            {["Qty", "Description", "Unit Price", "Total"].map((h, i) => (
              <div
                key={h}
                style={{
                  width: ["10%", "40%", "25%", "25%"][i],
                  color: navy,
                  fontSize: "15px",
                  fontWeight: "800",
                  fontFamily: "'Orbitron', sans-serif",
                  textAlign: i > 1 ? "center" : "left",
                }}
              >
                {h}
              </div>
            ))}
            <AddItemButton rawItems={rawItems} onFieldChange={onFieldChange} readOnly={readOnly} />
          </div>
          <div style={{ backgroundColor: "#feffeb", marginTop: "10px" }}>
            {readOnly
              ? items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "15px 15px",
                    }}
                  >
                    <div style={{ width: "10%", color: navy }}>
                      {item.quantity}
                    </div>
                    <div style={{ width: "40%", color: navy }}>
                      {item.description}
                    </div>
                    <div
                      style={{ width: "25%", color: navy, textAlign: "center" }}
                    >
                      {currencySymbol}
                      {item.rate.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div
                      style={{ width: "25%", color: navy, textAlign: "right" }}
                    >
                      {currencySymbol}
                      {item.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                ))
              : getEditableRows(rawItems).map((raw, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 15px",
                    }}
                  >
                    <div style={{ width: "10%" }}>
                      <EditableText
                        value={raw.qty}
                        onChange={f(`item${i + 1}Qty`)}
                        readOnly={false}
                        placeholder="1"
                      />
                    </div>
                    <div style={{ width: "40%" }}>
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
        </div>

        <div
          style={{
            padding: "30px 50px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "45%" }}>
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  color: navy,
                  fontWeight: "900",
                  fontSize: "16px",
                  margin: "0 0 8px 0",
                  fontFamily: "'Orbitron', sans-serif",
                }}
              >
                Terms and Conditions
              </p>
              <EditableText
                value={
                  Array.isArray(terms) ? terms.join(", ") : data.terms || ""
                }
                onChange={f("terms")}
                readOnly={readOnly}
                multiline
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  color: navy,
                  fontWeight: "900",
                  fontSize: "16px",
                  margin: "0 0 8px 0",
                  fontFamily: "'Orbitron', sans-serif",
                }}
              >
                Payment Info
              </p>
              {paymentType === "bank" ? (
                <>
                  <p style={{ fontSize: "14px", margin: "0 0 3px 0" }}>
                    <b>Bank Info:</b>{" "}
                    <EditableText
                      value={bankName}
                      onChange={f("bankName")}
                      readOnly={readOnly}
                    />
                  </p>
                  <p style={{ fontSize: "14px", margin: "0 0 3px 0" }}>
                    <b>Account No:</b>{" "}
                    <EditableText
                      value={accountNo}
                      onChange={f("accountNumber")}
                      readOnly={readOnly}
                    />
                  </p>
                  <p style={{ fontSize: "14px", margin: 0 }}>
                    <b>IFSC Code:</b>{" "}
                    <EditableText
                      value={ifscCode}
                      onChange={f("ifscCode")}
                      readOnly={readOnly}
                    />
                  </p>
                </>
              ) : (
                <p style={{ fontSize: "14px" }}>
                  <b>UPI ID:</b>{" "}
                  <EditableText
                    value={data.upiId || ""}
                    onChange={f("upiId")}
                    readOnly={readOnly}
                  />
                </p>
              )}
            </div>
            <div>
              {vis.signature && (
                <SignatureField
                  signatureImage={data.signatureImage}
                  onSignatureChange={f("signatureImage")}
                  readOnly={readOnly}
                />
              )}
            </div>
          </div>
          <div style={{ width: "45%" }}>
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: navy }}>Sub Total</span>
                <span style={{ color: coral, fontWeight: "700" }}>
                  {currencySymbol}
                  {subtotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: navy }}>
                  <EditableText
                    value={data.taxLabel || "Tax"}
                    onChange={f("taxLabel")}
                    readOnly={readOnly}
                  />
                </span>
                <span style={{ color: coral, fontWeight: "700" }}>
                  {currencySymbol}
                  {taxAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#fef3e2",
                  padding: "10px 15px",
                }}
              >
                <span
                  style={{
                    color: navy,
                    fontWeight: "900",
                    fontSize: "20px",
                    fontFamily: "'Syne', sans-serif",
                    letterSpacing: "2px",
                  }}
                >
                  TOTAL
                </span>
                <span
                  style={{ color: coral, fontWeight: "700", fontSize: "18px" }}
                >
                  {currencySymbol}
                  {total.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                </span>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#fef3e2",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: navy,
                  fontWeight: "700",
                  fontSize: "13px",
                  margin: "0 0 10px 0",
                  fontFamily: "'Orbitron', sans-serif",
                }}
              >
                Scan To Pay
              </p>
              {vis.qrCodeSection && (
                <QRUpload
                  qrImage={data.qrCodeImage}
                  fallbackImage={qrCodeImg}
                  onQRChange={f("qrCodeImage")}
                  readOnly={readOnly}
                  label=""
                  size={70}
                />
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "160px",
            left: "50px",
            right: "50px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: coral, fontSize: "14px", fontWeight: "700" }}>
            <EditableText
              value={website}
              onChange={f("footerWebsite")}
              readOnly={readOnly}
            />
          </span>
          <span style={{ color: coral, fontSize: "14px", fontWeight: "700" }}>
            <EditableText
              value={email}
              onChange={f("footerEmail")}
              readOnly={readOnly}
            />
            ,{" "}
            <EditableText
              value={phone}
              onChange={f("footerPhone")}
              readOnly={readOnly}
            />
          </span>
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

export default Templates3;
