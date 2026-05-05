import bgImage from "../../assets/templates/6_1.jpg";
import qrFallback from "../../assets/templates/images (1).png";
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

const Templates6 = ({
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
        className="w-[794px] h-[1123px] relative font-[Poppins] bg-no-repeat bg-top"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "794px 1123px",
        }}
      >
        <div className="px-[50px] pt-[60px] text-white">
          <div className="flex justify-between items-start">
            <div>
              <LogoUpload
                logoImage={data.logoImage || logo}
                logoText="LOGO"
                onLogoChange={f("logoImage")}
                readOnly={readOnly}
                textStyle={{
                  fontSize: "30px",
                  fontWeight: "700",
                  letterSpacing: "4px",
                  color: "#fff",
                }}
              />
              <p className="text-sm opacity-80 mt-6">
                <EditableText
                  value={companyName}
                  onChange={f("businessName")}
                  readOnly={readOnly}
                />
              </p>
              <h5 className="text-lg">
                <EditableText
                  value={companyAddress}
                  onChange={f("businessAddress1")}
                  readOnly={readOnly}
                />
              </h5>
            </div>
          </div>
        </div>

        <div className="px-[50px] mt-[70px] grid grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-medium">Bill To</p>
            <p className="font-semibold">
              <EditableText
                value={billToName}
                onChange={f("clientName")}
                readOnly={readOnly}
              />
            </p>
            <p className="font-semibold whitespace-pre-line">
              <EditableText
                value={billToAddress}
                onChange={f("clientAddress1")}
                readOnly={readOnly}
              />
            </p>
          </div>
          <div>
            <p className="font-medium">Ship To</p>
            <p className="font-semibold">
              <EditableText
                value={shipToName}
                onChange={f("shipToName")}
                readOnly={readOnly}
              />
            </p>
            <p className="font-semibold whitespace-pre-line">
              <EditableText
                value={shipToAddress}
                onChange={f("shipToAddress1")}
                readOnly={readOnly}
              />
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">INVOICE</p>
            <p>
              <span className="font-semibold">Invoice#:</span>{" "}
              <EditableText
                value={invoiceNumber}
                onChange={f("invoiceNumber")}
                readOnly={readOnly}
              />
            </p>
            <p>
              <span className="font-semibold">Invoice Date:</span>{" "}
              <EditableText
                value={invoiceDate}
                onChange={f("invoiceDate")}
                readOnly={readOnly}
              />
            </p>
            <p>
              <span className="font-semibold">P.O#:</span>{" "}
              <EditableText
                value={poNumber}
                onChange={f("poNumber")}
                readOnly={readOnly}
              />
            </p>
            <p>
              <span className="font-semibold">Due Date:</span>{" "}
              <EditableText
                value={dueDate}
                onChange={f("dueDate")}
                readOnly={readOnly}
              />
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="px-[50px] mt-10">
          <div className="grid grid-cols-[80px_1fr_140px_140px] bg-gray-100 px-4 py-3 font-semibold text-sm">
            <div>QTY</div>
            <div>DESCRIPTION</div>
            <div className="text-center">UNIT PRICE</div>
            <div className="text-right">AMOUNT</div>
          </div>
          {readOnly
            ? items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[80px_1fr_140px_140px] px-4 py-3 border-b text-sm"
                >
                  <div>{item.quantity}</div>
                  <div>{item.description}</div>
                  <div className="text-center">
                    {currencySymbol}
                    {item.rate.toLocaleString("en-IN")}
                  </div>
                  <div className="text-right">
                    {currencySymbol}
                    {item.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              ))
            : getEditableRows(rawItems).map((raw, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[80px_1fr_140px_140px] px-4 py-2 border-b text-sm"
                >
                  <div>
                    <EditableText
                      value={raw.qty}
                      onChange={f(`item${i + 1}Qty`)}
                      readOnly={false}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <EditableText
                      value={raw.desc}
                      onChange={f(`item${i + 1}Desc`)}
                      readOnly={false}
                      placeholder={`Item ${i + 1}`}
                    />
                  </div>
                  <div className="text-center">
                    <EditableText
                      value={raw.rate}
                      onChange={f(`item${i + 1}Rate`)}
                      readOnly={false}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="text-right">
                    {currencySymbol}
                    {(
                      (parseFloat(raw.qty) || 1) * (parseFloat(raw.rate) || 0)
                    ).toFixed(2)}
                  </div>
                </div>
              ))}
          <AddItemButton rawItems={rawItems} onFieldChange={onFieldChange} />
        </div>

        <div className="px-[50px] mt-8 flex justify-between text-sm">
          <div className="w-[50%]">
            <p className="font-bold mb-2">Terms and Conditions</p>
            <EditableText
              value={Array.isArray(terms) ? terms.join(", ") : data.terms || ""}
              onChange={f("terms")}
              readOnly={readOnly}
              multiline
            />
          </div>
          <div className="w-[35%] pr-3">
            <div className="flex justify-between mb-2">
              <span>Sub Total</span>
              <span className="font-semibold">
                {currencySymbol}
                {subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">
                <EditableText
                  value={data.taxLabel || "Tax"}
                  onChange={f("taxLabel")}
                  readOnly={readOnly}
                />
              </span>
              <span className="font-bold">
                {currencySymbol}
                {taxAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>
                {currencySymbol}
                {total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        <div className="px-[50px] mt-10 flex justify-between items-end text-sm">
          <div>
            <p className="font-bold mb-2">Payment Info</p>
            {paymentType === "bank" ? (
              <>
                <p>
                  <span className="font-semibold">Bank Name:</span>{" "}
                  <EditableText
                    value={bankName}
                    onChange={f("bankName")}
                    readOnly={readOnly}
                  />
                </p>
                <p>
                  <span className="font-semibold">Account No:</span>{" "}
                  <EditableText
                    value={accountNo}
                    onChange={f("accountNumber")}
                    readOnly={readOnly}
                  />
                </p>
                <p>
                  <span className="font-semibold">IFSC Code:</span>{" "}
                  <EditableText
                    value={ifscCode}
                    onChange={f("ifscCode")}
                    readOnly={readOnly}
                  />
                </p>
              </>
            ) : (
              <p>
                <span className="font-semibold">UPI ID:</span>{" "}
                <EditableText
                  value={data.upiId || ""}
                  onChange={f("upiId")}
                  readOnly={readOnly}
                />
              </p>
            )}
            <div className="mt-6">
              {vis.signature && (
                <SignatureField
                  signatureImage={data.signatureImage}
                  onSignatureChange={f("signatureImage")}
                  readOnly={readOnly}
                />
              )}
            </div>
          </div>
          <div className="text-center">
            {vis.qrCodeSection && (
              <QRUpload
                qrImage={data.qrCodeImage}
                fallbackImage={qrFallback}
                onQRChange={f("qrCodeImage")}
                readOnly={readOnly}
                label="Scan To Pay"
                size={112}
              />
            )}
          </div>
        </div>

        <p className="absolute bottom-[155px] right-[20px] font-semibold text-lg leading-tight text-center">
          Thank You For Your <br /> Business
        </p>
        <div className="absolute bottom-6 left-0 right-0 px-[50px] flex justify-between text-white text-xs">
          <span>
            <EditableText
              value={phone}
              onChange={f("footerPhone")}
              readOnly={readOnly}
            />
          </span>
          <span>
            <EditableText
              value={email}
              onChange={f("footerEmail")}
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

export default Templates6;
