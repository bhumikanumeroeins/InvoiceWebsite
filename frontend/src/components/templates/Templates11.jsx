import qrCodeImg from "../../assets/templates/images (1).png";
import { getInvoiceData } from "../../utils/invoiceDefaults";
import EditableText from "../shared/EditableText";
import LogoUpload from "../shared/LogoUpload";
import SignatureField from "../shared/SignatureField";
import QRUpload from "../shared/QRUpload";
import { getRawItems, getEditableRows, AddItemButton } from "../shared/templateHelpers";

const Templates11 = ({ data = {}, onFieldChange, readOnly = true }) => {
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
  const dark = "#24364f",
    light = "#eef2f5";

  return (
    <>
      <div
        style={{
          width: "835px",
          height: "1050px",
          position: "relative",
          background: "#fff",
          fontFamily: "'DM Sans', sans-serif",
          color: "#1f2937",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "230px",
            height: "100%",
            background: light,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 50,
            left: 30,
            right: 60,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <LogoUpload
              logoImage={data.logoImage}
              logoText="LOGO"
              onLogoChange={f("logoImage")}
              readOnly={readOnly}
              textStyle={{ fontSize: "24px", fontWeight: "700" }}
            />
            <p style={{ fontWeight: 700, marginTop: 10 }}>
              <EditableText
                value={companyName}
                onChange={f("businessName")}
                readOnly={readOnly}
              />
            </p>
            <p style={{ whiteSpace: "pre-line", fontSize: 14 }}>
              <EditableText
                value={companyAddress}
                onChange={f("businessAddress1")}
                readOnly={readOnly}
              />
            </p>
          </div>
          <div style={{ fontSize: 56, letterSpacing: 6, fontWeight: 300 }}>
            INVOICE
          </div>
        </div>

        <div
          style={{ position: "absolute", top: 160, right: 60, lineHeight: 1.8 }}
        >
          <div>
            <b>Invoice#</b>{" "}
            <EditableText
              value={invoiceNumber}
              onChange={f("invoiceNumber")}
              readOnly={readOnly}
            />
          </div>
          <div>
            <b>Invoice Date</b>{" "}
            <EditableText
              value={invoiceDate}
              onChange={f("invoiceDate")}
              readOnly={readOnly}
            />
          </div>
          <div>
            <b>P.O#</b>{" "}
            <EditableText
              value={poNumber}
              onChange={f("poNumber")}
              readOnly={readOnly}
            />
          </div>
          <div>
            <b>Due Date</b>{" "}
            <EditableText
              value={dueDate}
              onChange={f("dueDate")}
              readOnly={readOnly}
            />
          </div>
        </div>

        <div style={{ position: "absolute", top: 526, left: 30, width: 200 }}>
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
          <div style={{ marginTop: 68 }}>
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

        {/* Items */}
        <div
          style={{
            position: "absolute",
            top: 300,
            left: 165,
            right: 60,
            display: "flex",
            background: "#e6ecf1",
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: "12%",
              background: dark,
              color: "#fff",
              padding: 12,
            }}
          >
            Qty
          </div>
          <div style={{ width: "38%", padding: 12 }}>Description</div>
          <div style={{ width: "25%", padding: 12, textAlign: "center" }}>
            Unit Price
          </div>
          <div style={{ width: "25%", padding: 12, textAlign: "right" }}>
            Amount
          </div>
        </div>
        <div style={{ position: "absolute", top: 348, left: 165, right: 60 }}>
          {readOnly
            ? items.map((item, i) => (
                <div
                  key={i}
                  style={{ display: "flex", borderBottom: "1px solid #ddd" }}
                >
                  <div
                    style={{
                      width: "12%",
                      background: dark,
                      color: "#fff",
                      padding: 14,
                    }}
                  >
                    {item.quantity}
                  </div>
                  <div style={{ width: "38%", padding: 14 }}>
                    {item.description}
                  </div>
                  <div
                    style={{ width: "25%", padding: 14, textAlign: "center" }}
                  >
                    {currencySymbol}
                    {item.rate.toLocaleString("en-IN")}
                  </div>
                  <div
                    style={{ width: "25%", padding: 14, textAlign: "right" }}
                  >
                    {currencySymbol}
                    {item.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              ))
            : getEditableRows(rawItems).map((raw, i) => (
                <div
                  key={i}
                  style={{ display: "flex", borderBottom: "1px solid #ddd" }}
                >
                  <div
                    style={{
                      width: "12%",
                      background: dark,
                      color: "#fff",
                      padding: 8,
                    }}
                  >
                    <EditableText
                      value={raw.qty}
                      onChange={f(`item${i + 1}Qty`)}
                      readOnly={false}
                      placeholder="1"
                    />
                  </div>
                  <div style={{ width: "38%", padding: 8 }}>
                    <EditableText
                      value={raw.desc}
                      onChange={f(`item${i + 1}Desc`)}
                      readOnly={false}
                      placeholder={`Item ${i + 1}`}
                    />
                  </div>
                  <div
                    style={{ width: "25%", padding: 8, textAlign: "center" }}
                  >
                    <EditableText
                      value={raw.rate}
                      onChange={f(`item${i + 1}Rate`)}
                      readOnly={false}
                      placeholder="0.00"
                    />
                  </div>
                  <div style={{ width: "25%", padding: 8, textAlign: "right" }}>
                    {currencySymbol}
                    {(
                      (parseFloat(raw.qty) || 1) * (parseFloat(raw.rate) || 0)
                    ).toFixed(2)}
                  </div>
                </div>
              ))}
                <AddItemButton rawItems={rawItems} onFieldChange={onFieldChange} />
        </div>

        <div style={{ position: "absolute", top: 525, right: 75, width: 260 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Sub Total</span>
            <span>
              {currencySymbol}
              {subtotal.toLocaleString("en-IN")}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              <EditableText
                value={data.taxLabel || "Tax"}
                onChange={f("taxLabel")}
                readOnly={readOnly}
              />
            </span>
            <span>
              {currencySymbol}
              {taxAmount.toLocaleString("en-IN")}
            </span>
          </div>
          <div
            style={{
              marginTop: 10,
              background: dark,
              color: "#fff",
              padding: 12,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <b>Total</b>
            <b>
              {currencySymbol}
              {total.toLocaleString("en-IN")}
            </b>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 526,
            left: 250,
            width: 200,
            overflow: "hidden",
          }}
        >
          <b>Terms & Conditions</b>
          <EditableText
            value={Array.isArray(terms) ? terms.join(", ") : data.terms || ""}
            onChange={f("terms")}
            readOnly={readOnly}
            multiline
          />
        </div>

        <div style={{ position: "absolute", top: 675, left: 260, width: 300 }}>
          <b>Payment Info</b>
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
          <div style={{ marginTop: 30, textAlign: "center" }}>
            <SignatureField
              signatureImage={data.signatureImage}
              onSignatureChange={f("signatureImage")}
              readOnly={readOnly}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 680,
            right: 60,
            width: 220,
            background: light,
            padding: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <QRUpload
            qrImage={data.qrCodeImage}
            fallbackImage={qrCodeImg}
            onQRChange={f("qrCodeImage")}
            readOnly={readOnly}
            label="Scan To Pay"
            size={130}
          />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            background: dark,
            color: "#fff",
            padding: 16,
            display: "flex",
            justifyContent: "center",
            gap: 50,
          }}
        >
          <span>
            <EditableText
              value={email}
              onChange={f("footerEmail")}
              readOnly={readOnly}
            />
          </span>
          <span>
            <EditableText
              value={phone}
              onChange={f("footerPhone")}
              readOnly={readOnly}
            />
          </span>
          <span>
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

export default Templates11;