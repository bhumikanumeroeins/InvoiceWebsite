import bg from "../../assets/templates/12_1.png";
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

const Templates12 = ({
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
    currencySymbol,
  } = getInvoiceData(data);

  const f = (field) => (val) => onFieldChange && onFieldChange(field, val);
  const vis = { ...DEFAULT_VIS, ...visibility };
  const paymentType = data.paymentInfoType || "bank";
  const rawItems = getRawItems(data, items);
  const teal = "#2bb6b1";

  return (
    <>
      <div
        style={{
          width: "835px",
          height: "1050px",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          padding: "40px 50px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontFamily: "'DM Sans', sans-serif", height: "100%" }}>
          <div style={{ textAlign: "center", fontSize: 28, fontWeight: 700 }}>
            <LogoUpload
              logoImage={data.logoImage}
              logoText="LOGO"
              onLogoChange={f("logoImage")}
              readOnly={readOnly}
              textStyle={{ fontSize: "28px", fontWeight: "700" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 30,
            }}
          >
            <div>
              <b>
                <EditableText
                  value={companyName}
                  onChange={f("businessName")}
                  readOnly={readOnly}
                />
              </b>
              <p style={{ whiteSpace: "pre-line" }}>
                <EditableText
                  value={companyAddress}
                  onChange={f("businessAddress1")}
                  readOnly={readOnly}
                />
              </p>
            </div>
            <div>
              <b>Bill To</b>
              <p>
                <EditableText
                  value={billToName}
                  onChange={f("clientName")}
                  readOnly={readOnly}
                />
              </p>
              <p style={{ whiteSpace: "pre-line" }}>
                <EditableText
                  value={billToAddress}
                  onChange={f("clientAddress1")}
                  readOnly={readOnly}
                />
              </p>
            </div>
            <div>
              <b>Ship To</b>
              <p>
                <EditableText
                  value={shipToName}
                  onChange={f("shipToName")}
                  readOnly={readOnly}
                />
              </p>
              <p style={{ whiteSpace: "pre-line" }}>
                <EditableText
                  value={shipToAddress}
                  onChange={f("shipToAddress1")}
                  readOnly={readOnly}
                />
              </p>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: 260,
              left: "69%",
              transform: "translateX(-50%)",
              fontSize: 65,
              fontWeight: 700,
              color: "#434343",
            }}
          >
            invoice.
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 150,
            }}
          >
            {[
              ["Invoice#", invoiceNumber, "invoiceNumber"],
              ["Invoice Date", invoiceDate, "invoiceDate"],
              ["P.O#", poNumber, "poNumber"],
              ["Due Date", dueDate, "dueDate"],
            ].map(([label, val, field]) => (
              <div key={field} style={{ textAlign: "center" }}>
                <div
                  style={{
                    background: teal,
                    color: "#fff",
                    padding: "10px 22px",
                    fontWeight: 700,
                  }}
                >
                  {label}
                </div>
                <div style={{ marginTop: 8, fontWeight: 500 }}>
                  <EditableText
                    value={val}
                    onChange={f(field)}
                    readOnly={readOnly}
                  />
                </div>
              </div>
            ))}
            <AddItemButton rawItems={rawItems} onFieldChange={onFieldChange} />
          </div>

          {/* Items */}
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                display: "flex",
                background: teal,
                color: "#fff",
                padding: 12,
                fontWeight: 600,
              }}
            >
              <div style={{ width: "10%" }}>Qty</div>
              <div style={{ width: "40%" }}>Description</div>
              <div style={{ width: "25%", textAlign: "center" }}>
                Unit Price
              </div>
              <div style={{ width: "25%", textAlign: "right" }}>Amount</div>
            </div>
            {readOnly
              ? items.map((item, i) => (
                  <div key={i} style={{ display: "flex", padding: 12 }}>
                    <div style={{ width: "10%" }}>{item.quantity}</div>
                    <div style={{ width: "40%" }}>{item.description}</div>
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
                  <div key={i} style={{ display: "flex", padding: 8 }}>
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

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 40,
            }}
          >
            <div>
              <b>Terms & Conditions</b>
              <EditableText
                value={
                  Array.isArray(terms) ? terms.join(", ") : data.terms || ""
                }
                onChange={f("terms")}
                readOnly={readOnly}
                multiline
              />
            </div>
            <div style={{ width: 260 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <span style={{ minWidth: 90 }}>Subtotal</span>
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: teal,
                    margin: "0 10px",
                  }}
                />
                <span>
                  {currencySymbol}
                  {subtotal}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <span style={{ minWidth: 90 }}>
                  <EditableText
                    value={data.taxLabel || "Tax"}
                    onChange={f("taxLabel")}
                    readOnly={readOnly}
                  />
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: teal,
                    margin: "0 10px",
                  }}
                />
                <span>
                  {currencySymbol}
                  {taxAmount}
                </span>
              </div>
              <div
                style={{
                  background: teal,
                  color: "#fff",
                  padding: "12px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                }}
              >
                <span>Total</span>
                <span>
                  {currencySymbol}
                  {total}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 40,
            }}
          >
            <div>
              <b>Payment Info</b>
              {paymentType === "bank" ? (
                <>
                  <p>
                    <b>Bank Name:</b>{" "}
                    <EditableText
                      value={bankName}
                      onChange={f("bankName")}
                      readOnly={readOnly}
                    />
                  </p>
                  <p>
                    <b>Account No:</b>{" "}
                    <EditableText
                      value={accountNo}
                      onChange={f("accountNumber")}
                      readOnly={readOnly}
                    />
                  </p>
                  <p>
                    <b>IFSC Code:</b>{" "}
                    <EditableText
                      value={ifscCode}
                      onChange={f("ifscCode")}
                      readOnly={readOnly}
                    />
                  </p>
                </>
              ) : (
                <p>
                  <b>UPI ID:</b>{" "}
                  <EditableText
                    value={data.upiId || ""}
                    onChange={f("upiId")}
                    readOnly={readOnly}
                  />
                </p>
              )}
              <div style={{ marginTop: 20 }}>
                {vis.signature && (
                  <SignatureField
                    signatureImage={data.signatureImage}
                    onSignatureChange={f("signatureImage")}
                    readOnly={readOnly}
                  />
                )}
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
                  size={120}
                />
              )}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 30,
              width: "100%",
              textAlign: "center",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            THANK YOU FOR YOUR BUSINESS
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

export default Templates12;
