import bgImage from "../../assets/templates/1_4.jpeg";
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

const Templates2 = ({
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
          fontFamily: "'Fira Sans', sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "50px",
            textAlign: "left",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <LogoUpload
              logoImage={data.logoImage || logo}
              logoText="LOGO"
              onLogoChange={f("logoImage")}
              readOnly={readOnly}
              textStyle={{
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: "700",
              }}
            />
          </div>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "42px",
              fontWeight: "700",
              margin: "0 0 20px 0",
              letterSpacing: "2px",
            }}
          >
            INVOICE.
          </h1>
          <div
            style={{
              backgroundColor: "#000000",
              padding: "15px 20px",
              minWidth: "220px",
            }}
          >
            {[
              ["Invoice#", invoiceNumber, "invoiceNumber"],
              ["Invoice Date", invoiceDate, "invoiceDate"],
              ["P.O#", poNumber, "poNumber"],
              ["Due Date", dueDate, "dueDate"],
            ].map(([label, val, field]) => (
              <div
                key={field}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {label}
                </span>
                <span style={{ color: "#ffffff", fontSize: "14px" }}>
                  <EditableText
                    value={val}
                    onChange={f(field)}
                    readOnly={readOnly}
                  />
                </span>
              </div>
            ))}
            <AddItemButton rawItems={rawItems} onFieldChange={onFieldChange} />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: "360px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "85%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "30%" }}>
            <p
              style={{
                color: "#000000",
                fontWeight: "700",
                fontSize: "16px",
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
                color: "#4b5563",
                fontSize: "14px",
                margin: 0,
                whiteSpace: "pre-line",
                lineHeight: "1.6",
              }}
            >
              <EditableText
                value={companyAddress}
                onChange={f("businessAddress1")}
                readOnly={readOnly}
              />
            </p>
          </div>
          <div style={{ width: "30%" }}>
            <p
              style={{
                color: "#000000",
                fontWeight: "700",
                fontSize: "16px",
                margin: "0 0 5px 0",
              }}
            >
              Bill To
            </p>
            <p style={{ color: "#4b5563", fontSize: "14px", margin: 0 }}>
              <EditableText
                value={billToName}
                onChange={f("clientName")}
                readOnly={readOnly}
              />
            </p>
            <p style={{ color: "#4b5563", fontSize: "14px", margin: 0 }}>
              <EditableText
                value={billToAddress}
                onChange={f("clientAddress1")}
                readOnly={readOnly}
              />
            </p>
          </div>
          <div style={{ width: "30%" }}>
            <p
              style={{
                color: "#000000",
                fontWeight: "700",
                fontSize: "16px",
                margin: "0 0 5px 0",
              }}
            >
              Ship To
            </p>
            <p style={{ color: "#4b5563", fontSize: "14px", margin: 0 }}>
              <EditableText
                value={shipToName}
                onChange={f("shipToName")}
                readOnly={readOnly}
              />
            </p>
            <p style={{ color: "#4b5563", fontSize: "14px", margin: 0 }}>
              <EditableText
                value={shipToAddress}
                onChange={f("shipToAddress1")}
                readOnly={readOnly}
              />
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div
          style={{
            position: "absolute",
            top: "470px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "85%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "12%",
                backgroundColor: "#009ba0",
                padding: "10px 15px",
                color: "#000",
                fontSize: "17px",
                fontWeight: "700",
              }}
            >
              Qty
            </div>
            <div
              style={{
                width: "38%",
                backgroundColor: "#009ba0",
                padding: "10px 15px",
                color: "#000",
                fontSize: "17px",
                fontWeight: "700",
              }}
            >
              Description
            </div>
            <div
              style={{
                width: "25%",
                backgroundColor: "#ffb701",
                padding: "10px 15px",
                color: "#000",
                fontSize: "17px",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              Unit Price
            </div>
            <div
              style={{
                width: "25%",
                backgroundColor: "#ff76aa",
                padding: "10px 15px",
                color: "#000",
                fontSize: "17px",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              Amount
            </div>
          </div>
          <div style={{ backgroundColor: "#ffffff" }}>
            {readOnly
              ? items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid #535457ff",
                    }}
                  >
                    <div
                      style={{
                        width: "12%",
                        padding: "12px 15px",
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </div>
                    <div style={{ width: "38%", padding: "12px 15px" }}>
                      {item.description}
                    </div>
                    <div
                      style={{
                        width: "25%",
                        padding: "12px 15px",
                        textAlign: "center",
                      }}
                    >
                      {currencySymbol}
                      {item.rate.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div
                      style={{
                        width: "25%",
                        padding: "12px 15px",
                        textAlign: "center",
                      }}
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
                      borderBottom: "1px solid #535457ff",
                    }}
                  >
                    <div
                      style={{
                        width: "12%",
                        padding: "8px 15px",
                        textAlign: "center",
                      }}
                    >
                      <EditableText
                        value={raw.qty}
                        onChange={f(`item${i + 1}Qty`)}
                        readOnly={false}
                        placeholder="1"
                      />
                    </div>
                    <div style={{ width: "38%", padding: "8px 15px" }}>
                      <EditableText
                        value={raw.desc}
                        onChange={f(`item${i + 1}Desc`)}
                        readOnly={false}
                        placeholder={`Item ${i + 1}`}
                      />
                    </div>
                    <div
                      style={{
                        width: "25%",
                        padding: "8px 15px",
                        textAlign: "center",
                      }}
                    >
                      <EditableText
                        value={raw.rate}
                        onChange={f(`item${i + 1}Rate`)}
                        readOnly={false}
                        placeholder="0.00"
                      />
                    </div>
                    <div
                      style={{
                        width: "25%",
                        padding: "8px 15px",
                        textAlign: "center",
                      }}
                    >
                      {currencySymbol}
                      {(
                        (parseFloat(raw.qty) || 1) * (parseFloat(raw.rate) || 0)
                      ).toFixed(2)}
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Terms, Totals, Payment */}
        <div
          style={{
            position: "absolute",
            top: "690px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "85%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "45%" }}>
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  color: "#000000",
                  fontWeight: "700",
                  fontSize: "16px",
                  margin: "0 0 8px 0",
                }}
              >
                Terms & Conditions
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
                  color: "#000000",
                  fontWeight: "700",
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
                      color: "#374151",
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
                      color: "#374151",
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
                  <p
                    style={{
                      color: "#374151",
                      fontSize: "14px",
                      margin: "0 0 3px 0",
                    }}
                  >
                    <b>IFSC Code:</b>{" "}
                    <EditableText
                      value={ifscCode}
                      onChange={f("ifscCode")}
                      readOnly={readOnly}
                    />
                  </p>
                </>
              ) : (
                <p style={{ color: "#374151", fontSize: "14px" }}>
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
                <span style={{ fontWeight: "700" }}>Sub Total</span>
                <span>
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
                <span style={{ fontWeight: "700" }}>
                  <EditableText
                    value={data.taxLabel || "Tax"}
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
                  backgroundColor: "#ffb701",
                  padding: "10px 15px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontWeight: "700" }}>Total</span>
                <span style={{ fontWeight: "700" }}>
                  {currencySymbol}
                  {total.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                </span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              {vis.qrCodeSection && (
                <QRUpload
                  qrImage={data.qrCodeImage}
                  fallbackImage={qrCodeImg}
                  onQRChange={f("qrCodeImage")}
                  readOnly={readOnly}
                  label="Scan To Pay"
                  size={100}
                />
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            padding: "15px 50px",
          }}
        >
          <p
            style={{
              fontWeight: "700",
              fontSize: "18px",
              textAlign: "center",
              margin: "0 0 10px 0",
            }}
          >
            Thank for your business!
          </p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px" }}>
              <EditableText
                value={email}
                onChange={f("footerEmail")}
                readOnly={readOnly}
              />
            </span>
            <span style={{ fontSize: "13px" }}>
              <EditableText
                value={website}
                onChange={f("footerWebsite")}
                readOnly={readOnly}
              />
            </span>
            <span style={{ fontSize: "13px" }}>
              <EditableText
                value={phone}
                onChange={f("footerPhone")}
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

export default Templates2;
