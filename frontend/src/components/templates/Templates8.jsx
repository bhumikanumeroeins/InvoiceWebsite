import bgImage from "../../assets/templates/8_1.jpg";
import qrCodeImg from "../../assets/templates/images (1).png";
import { getInvoiceData } from "../../utils/invoiceDefaults";
import EditableText from "../shared/EditableText";
import LogoUpload from "../shared/LogoUpload";
import SignatureField from "../shared/SignatureField";
import QRUpload from "../shared/QRUpload";
import { getRawItems, getEditableRows, AddItemButton } from "../shared/templateHelpers";

const Templates8 = ({ data = {}, onFieldChange, readOnly = true }) => {
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
  const purple = "#3b2d4a",
    cream = "#fdeccd";

  return (
    <>
      <div
        style={{
          width: "794px",
          height: "1123px",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "794px 1123px",
          backgroundRepeat: "no-repeat",
          position: "relative",
          fontFamily: "'Cabin', sans-serif",
          color: "#2f2a3a",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "36px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
            color: "#fff",
          }}
        >
          <div>
            <LogoUpload
              logoImage={data.logoImage}
              logoText="LOGO"
              onLogoChange={f("logoImage")}
              readOnly={readOnly}
              textStyle={{
                fontFamily: "'Dela Gothic One'",
                fontSize: "24px",
                color: "#fff",
              }}
            />
            <p
              style={{ fontSize: "22px", fontWeight: "700", marginTop: "10px" }}
            >
              <EditableText
                value={companyName}
                onChange={f("businessName")}
                readOnly={readOnly}
              />
            </p>
            <p style={{ fontSize: "14px", whiteSpace: "pre-line" }}>
              <EditableText
                value={companyAddress}
                onChange={f("businessAddress1")}
                readOnly={readOnly}
              />
            </p>
          </div>
          <div>
            <p style={{ fontSize: "18px" }} className="font-extrabold">
              Bill To
            </p>
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
            <p style={{ fontSize: "18px" }} className="font-extrabold">
              Ship To
            </p>
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
            top: "200px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ fontSize: "14px", lineHeight: "1.7" }}>
            {[
              ["Invoice# :", invoiceNumber, "invoiceNumber"],
              ["Invoice Date: ", invoiceDate, "invoiceDate"],
              ["P.O#: ", poNumber, "poNumber"],
              ["Due Date: ", dueDate, "dueDate"],
            ].map(([label, val, field]) => (
              <div key={field}>
                <span className="inline-block min-w-[105px]">{label}</span>
                <b>
                  <EditableText
                    value={val}
                    onChange={f(field)}
                    readOnly={readOnly}
                  />
                </b>
              </div>
            ))}
              <AddItemButton rawItems={rawItems} onFieldChange={onFieldChange} />
          </div>
          <div
            style={{
              fontFamily: "'Dela Gothic One'",
              fontSize: "56px",
              color: purple,
              lineHeight: "1",
            }}
          >
            INVOICE
          </div>
        </div>

        {/* Items */}
        <div
          style={{
            position: "absolute",
            top: "345px",
            left: "80px",
            right: "80px",
          }}
        >
          <div
            style={{
              display: "flex",
              background: cream,
              padding: "12px 20px",
              borderRadius: "30px",
              fontWeight: "700",
            }}
          >
            <div style={{ width: "10%" }}>Qty</div>
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
                    padding: "12px 20px",
                    background: i === 1 ? cream : "transparent",
                    borderRadius: "30px",
                    marginTop: "6px",
                  }}
                >
                  <div style={{ width: "10%" }}>{item.quantity}</div>
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
                    padding: "8px 20px",
                    background: i === 1 ? cream : "transparent",
                    borderRadius: "30px",
                    marginTop: "6px",
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
            top: "600px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p style={{ fontWeight: "700" }}>Terms & Conditions</p>
            <EditableText
              value={Array.isArray(terms) ? terms.join(", ") : data.terms || ""}
              onChange={f("terms")}
              readOnly={readOnly}
              multiline
            />
          </div>
          <div>
            <div>
              <b className="inline-block min-w-[80px]">Sub total:</b>
              <span>
                {currencySymbol}
                {subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div>
              <b className="inline-block min-w-[80px]">
                <EditableText
                  value={data.taxLabel || "Tax:"}
                  onChange={f("taxLabel")}
                  readOnly={readOnly}
                />
              </b>
              <span>
                {currencySymbol}
                {taxAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div>
              <b className="inline-block min-w-[80px]">Total:</b>
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
            top: "720px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p style={{ fontWeight: "700" }}>Payment Info</p>
            <div>
              <b className="inline-block min-w-[60px]">Bank: </b>
              <EditableText
                value={bankName}
                onChange={f("bankName")}
                readOnly={readOnly}
              />
            </div>
            <div>
              <b className="inline-block min-w-[60px]">Account: </b>
              <EditableText
                value={accountNo}
                onChange={f("accountNumber")}
                readOnly={readOnly}
              />
            </div>
            <div>
              <b className="inline-block min-w-[60px]">IFSC: </b>
              <EditableText
                value={ifscCode}
                onChange={f("ifscCode")}
                readOnly={readOnly}
              />
            </div>
            <div style={{ marginTop: "40px", textAlign: "center" }}>
              <SignatureField
                signatureImage={data.signatureImage}
                onSignatureChange={f("signatureImage")}
                readOnly={readOnly}
              />
            </div>
          </div>
          <div
            style={{ background: cream, padding: "20px", textAlign: "center" }}
          >
            <QRUpload
              qrImage={data.qrCodeImage}
              fallbackImage={qrCodeImg}
              onQRChange={f("qrCodeImage")}
              readOnly={readOnly}
              label="Scan To Pay"
              size={100}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "25px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            color: "#fff",
            fontSize: "12px",
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

export default Templates8;