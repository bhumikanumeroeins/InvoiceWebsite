import qrCodeImg from "../../assets/templates/images (1).png";
import { getInvoiceData } from "../../utils/invoiceDefaults";
import EditableText from "../shared/EditableText";
import LogoUpload from "../shared/LogoUpload";
import SignatureField from "../shared/SignatureField";
import QRUpload from "../shared/QRUpload";
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

const Templates9 = ({
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
  const navy = "#1f2552",
    yellow = "#ffc21c";

  return (
    <>
      <div
        style={{
          width: "794px",
          height: "965px",
          position: "relative",
          background: "#ffffff",
          fontFamily: "'Open Sans', sans-serif",
          color: "#1f2552",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "80px",
            right: "80px",
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
              textStyle={{ fontFamily: "'Bebas Neue'", fontSize: "32px" }}
            />
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontWeight: "700", margin: 0 }}>
              <EditableText
                value={companyName}
                onChange={f("businessName")}
                readOnly={readOnly}
              />
            </p>
            <p style={{ margin: 0, whiteSpace: "pre-line" }}>
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
            position: "absolute",
            top: "110px",
            left: "0px",
            background: navy,
            color: "#fff",
            borderRadius: "0 40px 40px 0",
            padding: "0px 90px",
            fontFamily: "'Bebas Neue'",
            fontSize: "50px",
            letterSpacing: "2px",
          }}
        >
          INVOICE
        </div>

        <div
          style={{
            position: "absolute",
            top: "200px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p className="font-bold">Bill To</p>
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
            <p className="font-bold">Ship To</p>
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
          <div style={{ lineHeight: "1.7" }}>
            {[
              ["Invoice#:", invoiceNumber, "invoiceNumber"],
              ["Invoice Date:", invoiceDate, "invoiceDate"],
              ["P.O#:", poNumber, "poNumber"],
              ["Due Date:", dueDate, "dueDate"],
            ].map(([label, val, field]) => (
              <div key={field}>
                <b className="inline-block min-w-[120px]">{label}</b>
                <EditableText
                  value={val}
                  onChange={f(field)}
                  readOnly={readOnly}
                />
              </div>
            ))}
            <AddItemButton rawItems={rawItems} onFieldChange={onFieldChange} />
          </div>
        </div>

        {/* Items */}
        <div
          style={{
            position: "absolute",
            top: "340px",
            left: "0px",
            right: "80px",
          }}
        >
          <div
            style={{
              display: "flex",
              background: yellow,
              padding: "12px 12px 12px 50px",
              fontWeight: "700",
            }}
          >
            <div style={{ width: "10%", textAlign: "center" }}>Qty</div>
            <div style={{ width: "45%" }}>Description</div>
            <div style={{ width: "20%", textAlign: "center" }}>Unit Price</div>
            <div style={{ width: "25%", textAlign: "right" }}>Amount</div>
          </div>
          {readOnly
            ? items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    padding: "14px 14px 14px 50px",
                    borderBottom: "1px solid #d1d5db",
                  }}
                >
                  <div style={{ width: "10%", textAlign: "center" }}>
                    {item.quantity}
                  </div>
                  <div style={{ width: "45%" }}>{item.description}</div>
                  <div style={{ width: "20%", textAlign: "center" }}>
                    {currencySymbol}
                    {item.rate.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div style={{ width: "25%", textAlign: "right" }}>
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
                    padding: "8px 8px 8px 50px",
                    borderBottom: "1px solid #d1d5db",
                  }}
                >
                  <div style={{ width: "10%", textAlign: "center" }}>
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
                  <div style={{ width: "20%", textAlign: "center" }}>
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
            position: "absolute",
            top: "570px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              className="font-medium uppercase text-xl"
              style={{ fontFamily: "Bebas Neue" }}
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
          <div style={{ fontWeight: "700" }}>
            <div>
              <span style={{ fontFamily: "Bebas Neue" }}>Subtotal : </span>
              <span>
                {currencySymbol}
                {subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div>
              <span style={{ fontFamily: "Bebas Neue" }}>
                <EditableText
                  value={data.taxLabel || "Tax :"}
                  onChange={f("taxLabel")}
                  readOnly={readOnly}
                />
              </span>
              <span>
                {currencySymbol}
                {taxAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div style={{ fontSize: "20px" }}>
              <span style={{ fontFamily: "Bebas Neue" }}>Total : </span>
              <span>
                {currencySymbol}
                {total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: "710px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              className="font-medium text-xl"
              style={{ fontFamily: "Bebas Neue" }}
            >
              Payment Info
            </p>
            {paymentType === "bank" ? (
              <>
                <div>
                  <span className="inline-block min-w-[105px] font-medium">
                    Bank Name:
                  </span>{" "}
                  <EditableText
                    value={bankName}
                    onChange={f("bankName")}
                    readOnly={readOnly}
                  />
                </div>
                <div>
                  <span className="inline-block min-w-[105px] font-medium">
                    Account No:
                  </span>{" "}
                  <EditableText
                    value={accountNo}
                    onChange={f("accountNumber")}
                    readOnly={readOnly}
                  />
                </div>
                <div>
                  <span className="inline-block min-w-[105px] font-medium">
                    IFSC Code:
                  </span>{" "}
                  <EditableText
                    value={ifscCode}
                    onChange={f("ifscCode")}
                    readOnly={readOnly}
                  />
                </div>
              </>
            ) : (
              <div>
                <span className="inline-block min-w-[105px] font-medium">
                  UPI ID:
                </span>{" "}
                <EditableText
                  value={data.upiId || ""}
                  onChange={f("upiId")}
                  readOnly={readOnly}
                />
              </div>
            )}
            <div style={{ marginTop: "30px", textAlign: "center" }}>
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
                size={100}
              />
            )}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            background: navy,
            color: "#fff",
            padding: "15px 0",
            display: "flex",
            justifyContent: "center",
            gap: "50px",
            fontSize: "13px",
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

export default Templates9;
