import bgImage from "../../assets/templates/7_1.jpg";
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

const Templates7 = ({
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

  return (
    <>
      <div
        style={{
          width: "794px",
          height: "1123px",
          position: "relative",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "794px 1123px",
          backgroundRepeat: "no-repeat",
          fontFamily: "'DM Sans', sans-serif",
          color: "#111827",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "93px",
            left: "90px",
            right: "90px",
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
              textStyle={{ fontSize: "22px", fontWeight: "700" }}
            />
            <p style={{ margin: "10px 0 0" }} className="font-[Anton] text-xl">
              <EditableText
                value={companyName}
                onChange={f("businessName")}
                readOnly={readOnly}
              />
            </p>
            <p style={{ fontSize: "16px", marginTop: "5px" }}>
              <EditableText
                value={companyAddress}
                onChange={f("businessAddress1")}
                readOnly={readOnly}
              />
            </p>
          </div>
          <div style={{ fontSize: "15px", textAlign: "left" }}>
            <p>
              Invoice#:{" "}
              <span className="font-semibold">
                <EditableText
                  value={invoiceNumber}
                  onChange={f("invoiceNumber")}
                  readOnly={readOnly}
                />
              </span>
            </p>
            <p>
              Invoice Date:{" "}
              <span className="font-semibold">
                <EditableText
                  value={invoiceDate}
                  onChange={f("invoiceDate")}
                  readOnly={readOnly}
                />
              </span>
            </p>
            <p>
              P.O#:{" "}
              <span className="font-semibold">
                <EditableText
                  value={poNumber}
                  onChange={f("poNumber")}
                  readOnly={readOnly}
                />
              </span>
            </p>
            <p>
              Due Date:{" "}
              <span className="font-semibold">
                <EditableText
                  value={dueDate}
                  onChange={f("dueDate")}
                  readOnly={readOnly}
                />
              </span>
            </p>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: "230px",
            left: "90px",
            right: "90px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p className="font-[Anton] text-xl">Bill To</p>
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
            <p className="font-[Anton] text-xl">Ship To</p>
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
          <div
            style={{ fontSize: "70px", fontFamily: "'Anton', sans-serif" }}
            className="mt-[-46px]"
          >
            Invoice
          </div>
        </div>

        {/* Items */}
        <div
          style={{
            position: "absolute",
            top: "360px",
            left: "90px",
            right: "90px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontWeight: "700",
              paddingBottom: "12px",
            }}
            className="px-[20px]"
          >
            <div style={{ width: "10%" }}>Qty</div>
            <div style={{ width: "45%" }}>Description</div>
            <div style={{ width: "20%", textAlign: "center" }}>Unit Price</div>
            <div style={{ width: "25%", textAlign: "right" }}>Amount</div>
          </div>
          <div style={{ border: "2px solid #111827", padding: "8px 20px" }}>
            {readOnly
              ? items.map((item, i) => (
                  <div key={i} style={{ display: "flex", padding: "12px 0" }}>
                    <div style={{ width: "10%" }}>{item.quantity}.</div>
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
                  <div key={i} style={{ display: "flex", padding: "8px 0" }}>
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
            <AddItemButton rawItems={rawItems} onFieldChange={onFieldChange} readOnly={readOnly} />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: "590px",
            left: "90px",
            right: "90px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "45%" }}>
            <p style={{ fontWeight: "700" }}>Terms & Conditions</p>
            <EditableText
              value={Array.isArray(terms) ? terms.join(", ") : data.terms || ""}
              onChange={f("terms")}
              readOnly={readOnly}
              multiline
            />
          </div>
          <div style={{ width: "35%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "700",
              }}
            >
              <span>Sub Total</span>
              <span>
                {currencySymbol}
                {subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "700",
              }}
            >
              <span>
                <EditableText
                  value={data.taxLabel || "Tax"}
                  onChange={f("taxLabel")}
                  readOnly={readOnly}
                />
              </span>
              <span>
                {currencySymbol}
                {taxAmount}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "700",
                fontSize: "18px",
                marginTop: "8px",
              }}
            >
              <span>Total</span>
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
            top: "716px",
            left: "90px",
            width: "100px",
            height: "2px",
            backgroundColor: "#111827",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "740px",
            left: "90px",
            right: "90px",
            display: "grid",
            gridTemplateColumns: "40% 20% 40%",
            alignItems: "end",
          }}
        >
          <div>
            <p style={{ fontWeight: "700" }}>Payment Info</p>
            {paymentType === "bank" ? (
              <>
                <p>
                  <strong>Bank Name:</strong>{" "}
                  <EditableText
                    value={bankName}
                    onChange={f("bankName")}
                    readOnly={readOnly}
                  />
                </p>
                <p>
                  <strong>Account No:</strong>{" "}
                  <EditableText
                    value={accountNo}
                    onChange={f("accountNumber")}
                    readOnly={readOnly}
                  />
                </p>
                <p>
                  <strong>IFSC Code:</strong>{" "}
                  <EditableText
                    value={ifscCode}
                    onChange={f("ifscCode")}
                    readOnly={readOnly}
                  />
                </p>
              </>
            ) : (
              <p>
                <strong>UPI ID:</strong>{" "}
                <EditableText
                  value={data.upiId || ""}
                  onChange={f("upiId")}
                  readOnly={readOnly}
                />
              </p>
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            {vis.signature && (
              <SignatureField
                signatureImage={data.signatureImage}
                onSignatureChange={f("signatureImage")}
                readOnly={readOnly}
              />
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            {vis.qrCodeSection && (
              <QRUpload
                qrImage={data.qrCodeImage}
                fallbackImage={qrCodeImg}
                onQRChange={f("qrCodeImage")}
                readOnly={readOnly}
                label="Scan To Pay"
                size={90}
              />
            )}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "45px",
            right: "20px",
            display: "flex",
            gap: "40px",
            fontSize: "11px",
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

export default Templates7;
