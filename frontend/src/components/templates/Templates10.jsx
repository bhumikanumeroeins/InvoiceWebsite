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

const Templates10 = ({
  data = {},
  onFieldChange,
  readOnly = true,
  visibility = DEFAULT_VIS,
}) => {
  const vis = { ...DEFAULT_VIS, ...visibility };
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
    qrCode,
    email,
    phone,
    website,
    currencySymbol,
  } = getInvoiceData(data);

  const f = (field) => (val) => onFieldChange && onFieldChange(field, val);
  const dark = "#2f343a",
    grey = "#8c8f92";
  const rawItems = getRawItems(data, items);
  const paymentType = data.paymentInfoType || "bank";

  return (
    <>
      <div
        style={{
          width: "794px",
          height: "1050px",
          position: "relative",
          background: "#ffffff",
          fontFamily: "'Open Sans', sans-serif",
          color: "#1f2937",
        }}
      >
        {/* Header: Logo + Business Info */}
        <div
          style={{
            background: grey,
            color: "#fff",
            padding: "40px 80px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            {vis.logoSection && (
              <LogoUpload
                logoImage={data.logoImage}
                logoText="LOGO"
                onLogoChange={f("logoImage")}
                readOnly={readOnly}
                textStyle={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#fff",
                }}
              />
            )}
            {vis.businessInfo && (
              <>
                <p style={{ fontWeight: "700", marginTop: "10px" }}>
                  <EditableText
                    value={companyName}
                    onChange={f("businessName")}
                    readOnly={readOnly}
                  />
                </p>
                <p style={{ whiteSpace: "pre-line", fontSize: "14px" }}>
                  <EditableText
                    value={companyAddress}
                    onChange={f("businessAddress1")}
                    readOnly={readOnly}
                  />
                </p>
              </>
            )}
          </div>
          <div
            style={{
              fontSize: "70px",
              letterSpacing: "4px",
              fontWeight: "300",
            }}
          >
            INVOICE
          </div>
        </div>
        <div style={{ height: "6px", background: "rgb(47, 52, 58)" }} />
        <div
          style={{
            height: "6px",
            background:
              "linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)",
          }}
        />

        {/* Bill To / Ship To / Invoice Meta */}
        <div
          style={{
            position: "absolute",
            top: "225px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {vis.clientInfo && (
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
          )}
          {vis.shipTo && (
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
          )}
          {vis.invoiceMeta && (
            <div style={{ lineHeight: "1.8" }}>
              <div>
                <b className="inline-block min-w-[110px]">Invoice#:</b>
                <EditableText
                  value={invoiceNumber}
                  onChange={f("invoiceNumber")}
                  readOnly={readOnly}
                />
              </div>
              <div>
                <b className="inline-block min-w-[110px]">Invoice Date:</b>
                <EditableText
                  value={invoiceDate}
                  onChange={f("invoiceDate")}
                  readOnly={readOnly}
                />
              </div>
              <div>
                <b className="inline-block min-w-[110px]">P.O#:</b>
                <EditableText
                  value={poNumber}
                  onChange={f("poNumber")}
                  readOnly={readOnly}
                />
              </div>
              <div>
                <b className="inline-block min-w-[110px]">Due Date:</b>
                <EditableText
                  value={dueDate}
                  onChange={f("dueDate")}
                  readOnly={readOnly}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items Table */}
        {vis.itemsTable && (
          <div
            style={{
              position: "absolute",
              top: "360px",
              left: "80px",
              right: "80px",
            }}
          >
            <div style={{ height: "5px", background: "rgb(140, 143, 146)" }} />
            <div
              style={{
                display: "flex",
                background: dark,
                color: "#fff",
                padding: "12px",
              }}
            >
              <div style={{ width: "10%" }} className="font-medium">
                Qty
              </div>
              <div style={{ width: "45%" }} className="font-medium">
                Description
              </div>
              <div
                style={{ width: "20%", textAlign: "center" }}
                className="font-medium"
              >
                Unit Price
              </div>
              <div
                style={{ width: "25%", textAlign: "right" }}
                className="font-medium"
              >
                Amount
              </div>
            </div>
            <div
              style={{
                height: "5px",
                background:
                  "linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)",
              }}
            />
            {readOnly
              ? items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #d1d5db",
                    }}
                  >
                    <div
                      style={{
                        width: "10%",
                        padding: "14px",
                        background: "#f3f3f3",
                        fontWeight: "700",
                      }}
                    >
                      {item.quantity}
                    </div>
                    <div style={{ width: "45%", padding: "14px" }}>
                      {item.description}
                    </div>
                    <div
                      style={{
                        width: "20%",
                        padding: "14px",
                        background: "#f3f3f3",
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
                        padding: "14px",
                        textAlign: "right",
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
                      borderBottom: "1px solid #d1d5db",
                    }}
                  >
                    <div
                      style={{
                        width: "10%",
                        padding: "8px",
                        background: "#f3f3f3",
                        fontWeight: "700",
                      }}
                    >
                      <EditableText
                        value={raw.qty}
                        onChange={f(`item${i + 1}Qty`)}
                        readOnly={false}
                        placeholder="1"
                      />
                    </div>
                    <div style={{ width: "45%", padding: "8px" }}>
                      <EditableText
                        value={raw.desc}
                        onChange={f(`item${i + 1}Desc`)}
                        readOnly={false}
                        placeholder={`Item ${i + 1}`}
                      />
                    </div>
                    <div
                      style={{
                        width: "20%",
                        padding: "8px",
                        background: "#f3f3f3",
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
                        padding: "8px",
                        textAlign: "right",
                      }}
                    >
                      {currencySymbol}
                      {(
                        (parseFloat(raw.qty) || 1) * (parseFloat(raw.rate) || 0)
                      ).toFixed(2)}
                    </div>
                  </div>
                ))}
            <AddItemButton rawItems={rawItems} onFieldChange={onFieldChange} />
          </div>
        )}

        {/* Terms & Totals */}
        <div
          style={{
            position: "absolute",
            top: "620px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {vis.terms && (
            <div>
              <p className="font-bold">Terms and Conditions</p>
              <EditableText
                value={
                  Array.isArray(terms) ? terms.join(", ") : data.terms || ""
                }
                onChange={f("terms")}
                readOnly={readOnly}
                multiline
              />
            </div>
          )}
          {vis.totals && (
            <div style={{ minWidth: "250px" }}>
              <div>
                <b className="uppercase inline-block min-w-[175px]">
                  Subtotal:
                </b>
                <span>
                  {currencySymbol}
                  {subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <b className="uppercase inline-block min-w-[175px]">
                  <EditableText
                    value={data.taxLabel || "Tax (0%):"}
                    onChange={f("taxLabel")}
                    readOnly={readOnly}
                  />
                </b>
                <span>
                  {currencySymbol}
                  {taxAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div
                style={{
                  height: "10px",
                  background: "#9ca3af",
                  marginTop: "12px",
                }}
              />
              <div
                style={{
                  background: dark,
                  color: "#fff",
                  padding: "12px",
                  fontWeight: "700",
                }}
              >
                <b className="uppercase inline-block min-w-[150px]">Total:</b>{" "}
                <span>
                  {currencySymbol}
                  {total.toLocaleString("en-IN")}
                </span>
              </div>
              <div
                style={{
                  height: "4px",
                  background:
                    "linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)",
                }}
              />
            </div>
          )}
        </div>

        {/* Payment + Signature + QR */}
        {(vis.paymentInfo || vis.signature || vis.qrCodeSection) && (
          <div
            style={{
              position: "absolute",
              top: "760px",
              left: "80px",
              right: "140px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {vis.paymentInfo && (
              <div>
                <p className="font-bold">Payment Info</p>
                {paymentType === "bank" ? (
                  <>
                    <div>
                      <span className="font-semibold inline-block min-w-[100px]">
                        Bank Name:
                      </span>{" "}
                      <EditableText
                        value={bankName}
                        onChange={f("bankName")}
                        readOnly={readOnly}
                      />
                    </div>
                    <div>
                      <span className="font-semibold inline-block min-w-[100px]">
                        Account No:
                      </span>{" "}
                      <EditableText
                        value={accountNo}
                        onChange={f("accountNumber")}
                        readOnly={readOnly}
                      />
                    </div>
                    <div>
                      <span className="font-semibold inline-block min-w-[100px]">
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
                    <span className="font-semibold inline-block min-w-[100px]">
                      UPI ID:
                    </span>{" "}
                    <EditableText
                      value={data.upiId || ""}
                      onChange={f("upiId")}
                      readOnly={readOnly}
                    />
                  </div>
                )}
                {vis.signature && (
                  <div style={{ marginTop: "30px" }}>
                    <SignatureField
                      signatureImage={data.signatureImage}
                      onSignatureChange={f("signatureImage")}
                      readOnly={readOnly}
                    />
                  </div>
                )}
              </div>
            )}
            {vis.qrCodeSection && (
              <QRUpload
                qrImage={data.qrCodeImage || qrCode}
                fallbackImage={qrCodeImg}
                onQRChange={f("qrCodeImage")}
                readOnly={readOnly}
                label="SCAN TO PAY"
                size={120}
              />
            )}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            background: dark,
            color: "#fff",
            padding: "15px 0",
            display: "flex",
            justifyContent: "center",
            gap: "50px",
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

export default Templates10;
