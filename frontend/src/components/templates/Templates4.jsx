import bgImage from "../../assets/templates/4_1.jpg";
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

const Templates4 = ({
  data = {},
  onFieldChange,
  readOnly = true,
  visibility = DEFAULT_VIS,
}) => {
  const {
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
  const pink = "#be549f",
    gray = "#374151";

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
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div style={{ padding: "110px 50px 0", marginLeft: "100px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "4px solid #374151",
                transform: "rotate(45deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  transform: "rotate(-45deg)",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                ⌂
              </div>
            </div>
            <LogoUpload
              logoImage={data.logoImage}
              logoText="LOGO"
              onLogoChange={f("logoImage")}
              readOnly={readOnly}
              textStyle={{ color: gray, fontSize: "30px", fontWeight: "700" }}
            />
          </div>
          <p
            style={{
              color: gray,
              fontSize: "15px",
              fontWeight: "700",
              margin: "0 0 5px 0",
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
              color: "#6b7280",
              fontSize: "13px",
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

        <div style={{ position: "absolute", top: "110px", right: "50px" }}>
          {[
            ["Invoice#", invoiceNumber, "invoiceNumber"],
            ["Invoice Date", invoiceDate, "invoiceDate"],
            ["P.O#", poNumber, "poNumber"],
            ["Due Date", dueDate, "dueDate"],
          ].map(([label, val, field]) => (
            <div key={field} style={{ display: "flex", marginBottom: "8px" }}>
              <span
                style={{
                  color: gray,
                  fontSize: "13px",
                  fontWeight: "700",
                  width: "110px",
                }}
              >
                {label}
              </span>
              <span style={{ color: "#6b7280", fontSize: "13px" }}>
                <EditableText
                  value={val}
                  onChange={f(field)}
                  readOnly={readOnly}
                />
              </span>
            </div>
          ))}
          <AddItemButton rawItems={rawItems} onFieldChange={onFieldChange} readOnly={readOnly} />
        </div>

        {/* Items */}
        <div style={{ padding: "50px 50px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingBottom: "10px",
            }}
          >
            {["Qty", "Description", "Unit Price", "Amount"].map((h, i) => (
              <div
                key={h}
                style={{
                  width: ["10%", "45%", "22%", "23%"][i],
                  color: pink,
                  fontSize: "14px",
                  fontWeight: "700",
                  textAlign: i > 1 ? "center" : "left",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </div>
            ))}
          </div>
          {readOnly
            ? items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "18px 0",
                    borderBottom: "1px solid #6b7280",
                  }}
                >
                  <div style={{ width: "10%", color: gray }}>
                    {item.quantity}
                  </div>
                  <div style={{ width: "45%", color: gray }}>
                    {item.description}
                  </div>
                  <div
                    style={{ width: "22%", color: gray, textAlign: "center" }}
                  >
                    {currencySymbol}
                    {item.rate.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div
                    style={{ width: "23%", color: gray, textAlign: "right" }}
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
                    padding: "8px 0",
                    borderBottom: "1px solid #6b7280",
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
                  <div style={{ width: "45%" }}>
                    <EditableText
                      value={raw.desc}
                      onChange={f(`item${i + 1}Desc`)}
                      readOnly={false}
                      placeholder={`Item ${i + 1}`}
                    />
                  </div>
                  <div style={{ width: "22%", textAlign: "center" }}>
                    <EditableText
                      value={raw.rate}
                      onChange={f(`item${i + 1}Rate`)}
                      readOnly={false}
                      placeholder="0.00"
                    />
                  </div>
                  <div style={{ width: "23%", textAlign: "right" }}>
                    {currencySymbol}
                    {(
                      (parseFloat(raw.qty) || 1) * (parseFloat(raw.rate) || 0)
                    ).toFixed(2)}
                  </div>
                </div>
              ))}
        </div>

        <div
          style={{
            padding: "35px 50px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "28%" }}>
            <p
              style={{
                color: pink,
                fontWeight: "600",
                fontSize: "16px",
                margin: "0 0 8px 0",
              }}
            >
              Bill To
            </p>
            <p style={{ color: gray, fontSize: "14px", margin: 0 }}>
              <EditableText
                value={billToName}
                onChange={f("clientName")}
                readOnly={readOnly}
              />
            </p>
            <p style={{ color: gray, fontSize: "14px", margin: 0 }}>
              <EditableText
                value={billToAddress}
                onChange={f("clientAddress1")}
                readOnly={readOnly}
              />
            </p>
          </div>
          <div style={{ width: "28%" }}>
            <p
              style={{
                color: pink,
                fontWeight: "600",
                fontSize: "16px",
                margin: "0 0 8px 0",
              }}
            >
              Ship To
            </p>
            <p style={{ color: gray, fontSize: "14px", margin: 0 }}>
              <EditableText
                value={shipToName}
                onChange={f("shipToName")}
                readOnly={readOnly}
              />
            </p>
            <p style={{ color: gray, fontSize: "14px", margin: 0 }}>
              <EditableText
                value={shipToAddress}
                onChange={f("shipToAddress1")}
                readOnly={readOnly}
              />
            </p>
          </div>
          <div style={{ width: "35%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: gray, fontWeight: "800" }}>Sub Total:</span>
              <span>
                {currencySymbol}
                {subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: gray, fontWeight: "800" }}>
                <EditableText
                  value={data.taxLabel || "Tax:"}
                  onChange={f("taxLabel")}
                  readOnly={readOnly}
                />
              </span>
              <span>
                {currencySymbol}
                {taxAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
            <div
              style={{
                borderTop: "2px solid #374151",
                paddingTop: "8px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: gray, fontWeight: "800" }}>Total:</span>
              <span>
                {currencySymbol}
                {total.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "35px 50px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "55%" }}>
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  color: pink,
                  fontWeight: "600",
                  fontSize: "16px",
                  margin: "0 0 8px 0",
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
            <div>
              <p
                style={{
                  color: pink,
                  fontWeight: "600",
                  fontSize: "16px",
                  margin: "0 0 8px 0",
                }}
              >
                Payment Info
              </p>
              {paymentType === "bank" ? (
                <>
                  <p
                    style={{
                      color: gray,
                      fontSize: "14px",
                      margin: "0 0 3px 0",
                    }}
                  >
                    <b>Bank Name:</b>{" "}
                    <EditableText
                      value={bankName}
                      onChange={f("bankName")}
                      readOnly={readOnly}
                    />
                  </p>
                  <p
                    style={{
                      color: gray,
                      fontSize: "14px",
                      margin: "0 0 3px 0",
                    }}
                  >
                    <b>Account No:</b>{" "}
                    <EditableText
                      value={accountNo}
                      onChange={f("accountNumber")}
                      readOnly={readOnly}
                    />
                  </p>
                  <p style={{ color: gray, fontSize: "14px", margin: 0 }}>
                    <b>IFSC Code:</b>{" "}
                    <EditableText
                      value={ifscCode}
                      onChange={f("ifscCode")}
                      readOnly={readOnly}
                    />
                  </p>
                </>
              ) : (
                <p style={{ color: gray, fontSize: "14px" }}>
                  <b>UPI ID:</b>{" "}
                  <EditableText
                    value={data.upiId || ""}
                    onChange={f("upiId")}
                    readOnly={readOnly}
                  />
                </p>
              )}
            </div>
          </div>
          <div style={{ width: "40%" }}>
            <div
              style={{
                backgroundColor: pink,
                padding: "15px",
                textAlign: "center",
              }}
            >
              {vis.qrCodeSection && (
                <QRUpload
                  qrImage={data.qrCodeImage}
                  fallbackImage={qrCodeImg}
                  onQRChange={f("qrCodeImage")}
                  readOnly={readOnly}
                  label="Scan To Pay"
                  size={90}
                  style={{ backgroundColor: "#fff", padding: "5px" }}
                />
              )}
            </div>
            <div style={{ marginTop: "25px", textAlign: "center" }}>
              {vis.signature && (
                <SignatureField
                  signatureImage={data.signatureImage}
                  onSignatureChange={f("signatureImage")}
                  readOnly={readOnly}
                />
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: "0px 50px 0" }}>
          <p
            style={{
              color: gray,
              fontSize: "16px",
              fontWeight: "600",
              margin: "0 0 25px 0",
            }}
          >
            Thank you for your business
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ color: gray, fontSize: "13px" }}>
              <EditableText
                value={email}
                onChange={f("footerEmail")}
                readOnly={readOnly}
              />
            </span>
            <span>|</span>
            <span style={{ color: gray, fontSize: "13px" }}>
              <EditableText
                value={phone}
                onChange={f("footerPhone")}
                readOnly={readOnly}
              />
            </span>
            <span>|</span>
            <span style={{ color: gray, fontSize: "13px" }}>
              <EditableText
                value={website}
                onChange={f("footerWebsite")}
                readOnly={readOnly}
              />
            </span>
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

export default Templates4;
