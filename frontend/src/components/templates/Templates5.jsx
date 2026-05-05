import bgImage from "../../assets/templates/5_1.jpg";
import qrCodeImg from "../../assets/templates/images (1).png";
import { getInvoiceData } from "../../utils/invoiceDefaults";
import EditableText from "../shared/EditableText";
import LogoUpload from "../shared/LogoUpload";
import { getRawItems, getEditableRows, AddItemButton } from "../shared/templateHelpers";

const Templates5 = ({ data = {}, onFieldChange, readOnly = true }) => {
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
  const rawItems = getRawItems(data, items);
  const purple = "#33265d",
    orange = "#fec62f",
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
          fontFamily: "'Albert Sans', sans-serif",
        }}
      >
        <div
          style={{
            padding: "38px 100px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <LogoUpload
              logoImage={data.logoImage}
              logoText="LOGO"
              onLogoChange={f("logoImage")}
              readOnly={readOnly}
              textStyle={{ color: "#fff", fontSize: "28px", fontWeight: "400" }}
            />
            <p
              style={{
                color: orange,
                fontSize: "32px",
                fontWeight: "400",
                margin: "0",
                fontFamily: "'Passion One', cursive",
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
                color: "#fff",
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
          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "800",
                  margin: "0 0 5px 0",
                }}
              >
                Bill To
              </p>
              <p style={{ color: "#fff", fontSize: "14px", margin: 0 }}>
                <EditableText
                  value={billToName}
                  onChange={f("clientName")}
                  readOnly={readOnly}
                />
              </p>
              <p style={{ color: "#fff", fontSize: "14px", margin: 0 }}>
                <EditableText
                  value={billToAddress}
                  onChange={f("clientAddress1")}
                  readOnly={readOnly}
                />
              </p>
            </div>
            <div>
              <p
                style={{
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "800",
                  margin: "0 0 5px 0",
                }}
              >
                Ship To
              </p>
              <p style={{ color: "#fff", fontSize: "14px", margin: 0 }}>
                <EditableText
                  value={shipToName}
                  onChange={f("shipToName")}
                  readOnly={readOnly}
                />
              </p>
              <p style={{ color: "#fff", fontSize: "14px", margin: 0 }}>
                <EditableText
                  value={shipToAddress}
                  onChange={f("shipToAddress1")}
                  readOnly={readOnly}
                />
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "25px 80px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            {[
              ["Invoice#:", invoiceNumber, "invoiceNumber"],
              ["Invoice Date:", invoiceDate, "invoiceDate"],
              ["P.O#:", poNumber, "poNumber"],
              ["Due Date:", dueDate, "dueDate"],
            ].map(([label, val, field]) => (
              <div key={field} style={{ display: "flex", marginBottom: "5px" }}>
                <span
                  style={{
                    color: purple,
                    fontSize: "16px",
                    fontWeight: "600",
                    width: "100px",
                  }}
                >
                  {label}
                </span>
                <span style={{ color: gray, fontSize: "16px" }}>
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
          <div>
            <p
              style={{
                color: "#b374fe",
                fontSize: "50px",
                fontWeight: "400",
                margin: 0,
                fontFamily: "'Passion One', cursive",
              }}
            >
              INVOICE
            </p>
          </div>
        </div>

        {/* Items */}
        <div style={{ padding: "30px 80px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f1e4fe",
              padding: "12px 15px",
              borderRadius: "25px",
            }}
          >
            {["Qty", "Description", "Unit Price", "Amount"].map((h, i) => (
              <div
                key={h}
                style={{
                  width: ["10%", "45%", "22%", "23%"][i],
                  color: purple,
                  fontSize: "17px",
                  fontWeight: "500",
                  fontFamily: "'Passion One', cursive",
                  textAlign: i > 1 ? "center" : "left",
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
                    padding: "15px 15px",
                    backgroundColor: i % 2 === 0 ? "#fff" : "#f1e4fe",
                    borderRadius: i % 2 === 0 ? "0" : "25px",
                    marginTop: "5px",
                  }}
                >
                  <div style={{ width: "10%", color: purple }}>
                    {item.quantity}
                  </div>
                  <div style={{ width: "45%", color: purple }}>
                    {item.description}
                  </div>
                  <div
                    style={{ width: "22%", color: purple, textAlign: "center" }}
                  >
                    {currencySymbol}
                    {item.rate.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div
                    style={{ width: "23%", color: purple, textAlign: "right" }}
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
                    backgroundColor: i % 2 === 0 ? "#fff" : "#f1e4fe",
                    borderRadius: i % 2 === 0 ? "0" : "25px",
                    marginTop: "5px",
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
            padding: "25px 80px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "40%" }}>
            <p
              style={{
                color: gray,
                fontWeight: "700",
                fontSize: "16px",
                margin: "0 0 10px 0",
              }}
            >
              Terms and Conditions
            </p>
            <EditableText
              value={Array.isArray(terms) ? terms.join(", ") : data.terms || ""}
              onChange={f("terms")}
              readOnly={readOnly}
              multiline
            />
          </div>
          <div style={{ width: "40%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontWeight: "600" }}>Sub total</span>
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
              <span style={{ fontWeight: "600" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "700" }}>Total</span>
              <span style={{ fontWeight: "700" }}>
                {currencySymbol}
                {total.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "15px 80px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "50%" }}>
            <p
              style={{
                color: gray,
                fontWeight: "700",
                fontSize: "13px",
                margin: "0 0 10px 0",
              }}
            >
              Payment Info
            </p>
            <p style={{ fontSize: "11px", margin: "0 0 3px 0" }}>
              <b>Bank Name:</b>{" "}
              <EditableText
                value={bankName}
                onChange={f("bankName")}
                readOnly={readOnly}
              />
            </p>
            <p style={{ fontSize: "11px", margin: "0 0 3px 0" }}>
              <b>Account No:</b>{" "}
              <EditableText
                value={accountNo}
                onChange={f("accountNumber")}
                readOnly={readOnly}
              />
            </p>
            <p style={{ fontSize: "11px", margin: 0 }}>
              <b>IFSC Code:</b>{" "}
              <EditableText
                value={ifscCode}
                onChange={f("ifscCode")}
                readOnly={readOnly}
              />
            </p>
          </div>
          <div style={{ width: "70%", textAlign: "center" }}>
            <QRUpload
              qrImage={data.qrCodeImage}
              fallbackImage={qrCodeImg}
              onQRChange={f("qrCodeImage")}
              readOnly={readOnly}
              label="Scan to Pay"
              size={80}
            />
            <div style={{ marginTop: "10px" }}>
              <SignatureField
                signatureImage={data.signatureImage}
                onSignatureChange={f("signatureImage")}
                readOnly={readOnly}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "45px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "#fff", fontSize: "11px" }}>
            <EditableText
              value={email}
              onChange={f("footerEmail")}
              readOnly={readOnly}
            />
          </span>
          <span style={{ color: "#fff", fontSize: "11px" }}>
            <EditableText
              value={phone}
              onChange={f("footerPhone")}
              readOnly={readOnly}
            />
          </span>
          <span style={{ color: "#fff", fontSize: "11px" }}>
            <EditableText
              value={website}
              onChange={f("footerWebsite")}
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

export default Templates5;