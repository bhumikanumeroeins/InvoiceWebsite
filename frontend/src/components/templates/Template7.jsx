import bgImage from "../../assets/templates/7_1.jpg";
import qrCodeImg from "../../assets/templates/images (1).png";
import { getInvoiceData } from "../../utils/invoiceDefaults";

const Template7 = ({ data = {} }) => {
  const {
    companyName, companyAddress,
    billToName, billToAddress,
    shipToName, shipToAddress,
    invoiceNumber, invoiceDate, poNumber, dueDate,
    items, terms, subtotal, taxAmount, total,
    bankName, accountNo, ifscCode,
    signature, qrCode,
    email, phone, website
  } = getInvoiceData(data);

  return (
    <div
      style={{
        width: "794px",
        height: "1123px",
        position: "relative",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "794px 1123px",
        backgroundRepeat: "no-repeat",
        fontFamily: "'DM Sans', sans-serif",
        color: "#111827"
      }}
    >

      {/* HEADER */}
      <div style={{ position: "absolute", top: "93px", left: "90px", right: "90px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p 
          style={{
            fontSize: "22px",
            fontWeight: "700",
            margin: 0,
            width: "100%"
            }}>LOGO</p>
          <p style={{margin: "10px 0 0" }} className="font-[Anton] text-xl">{companyName}</p>
          <p style={{ fontSize: "16px", marginTop: "5px" }} className="font-regular">{companyAddress}</p>
        </div>

        <div style={{ fontSize: "15px", textAlign: "left" }}>
          <p>Invoice#: <span className="font-semibold">{invoiceNumber}</span></p>
          <p>Invoice Date: <span className="font-semibold">{invoiceDate}</span></p>
          <p>P.O#: <span className="font-semibold">{poNumber}</span></p>
          <p>Due Date: <span className="font-semibold">{dueDate}</span></p>
        </div>
      </div>

      {/* BILL / SHIP / TITLE */}
      <div style={{ position: "absolute", top: "230px", left: "90px", right: "90px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p className="font-[Anton] text-xl">Bill To</p>
          <p>{billToName}</p>
          <p style={{ whiteSpace: "pre-line" }}>{billToAddress}</p>
        </div>

        <div>
          <p className="font-[Anton] text-xl">Ship To</p>
          <p>{shipToName}</p>
          <p style={{ whiteSpace: "pre-line" }}>{shipToAddress}</p>
        </div>

        <div style={{ fontSize: "70px", fontFamily: "'Anton', sans-serif" }} className="mt-[-46px]">
          Invoice
        </div>
      </div>

        {/* TABLE */}
        <div style={{ position: "absolute", top: "360px", left: "90px", right: "90px" }}>

        {/* Header OUTSIDE the box */}
        <div style={{ display: "flex", fontWeight: "700", paddingBottom: "12px" }} className="px-[20px]">
            <div style={{ width: "10%" }}>Qty</div>
            <div style={{ width: "45%" }}>Description</div>
            <div style={{ width: "20%", textAlign: "center" }}>Unit Price</div>
            <div style={{ width: "25%", textAlign: "right" }}>Amount</div>
        </div>

        {/* Rows INSIDE black box */}
        <div style={{ border: "2px solid #111827", padding: "8px 20px" }}>
            {items.map((item, i) => (
            <div
                key={i}
                style={{
                display: "flex",
                padding: "12px 0"
                }}
            >
                <div style={{ width: "10%" }}>{item.qty}.</div>
                <div style={{ width: "45%" }}>{item.description}</div>
                <div style={{ width: "20%", textAlign: "center" }}>
                {item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
                <div style={{ width: "25%", textAlign: "right" }}>
                {item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
            </div>
            ))}
        </div>

        </div>


      {/* TERMS + TOTAL */}
      <div style={{ position: "absolute", top: "590px", left: "90px", right: "90px", display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "45%" }}>
          <p style={{ fontWeight: "700" }}>Terms & Conditions</p>
          {terms.map((t, i) => <p key={i}>■ {t}</p>)}
        </div>

        <div style={{ width: "35%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700" }}>
            <span>Sub Total</span><span>{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700"}}>
            <span>Tax</span><span>{taxAmount}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "18px", marginTop: "8px" }}>
            <span>Total</span><span>{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* SECTION DIVIDER */}
        <div
        style={{
            position: "absolute",
            top: "716px",        // perfect vertical alignment
            left: "90px",
            width: "100px",     // same width as terms column
            height: "2px",
            backgroundColor: "#111827"
        }}
        />


      {/* PAYMENT + SIGNATURE + QR */}
        <div
            style={{
                position: "absolute",
                top: "740px",
                left: "90px",
                right: "90px",
                display: "grid",
                gridTemplateColumns: "40% 20% 40%",
                alignItems: "end"
            }}
        >

        {/* Payment Info */}
        <div>
            <p style={{ fontWeight: "700" }}>Payment Info</p>
            <p><strong>Bank Name:</strong> {bankName}</p>
            <p><strong>Account No:</strong> {accountNo}</p>
            <p><strong>IFSC Code:</strong> {ifscCode}</p>
        </div>

        {/* Signature */}
        <div style={{ textAlign: "center" }}>
            {signature ? (
            <img src={signature} style={{ height: "40px", marginBottom: "5px" }} />
            ) : (
            <div style={{ borderBottom: "1px solid #000", width: "120px", margin: "0 auto 5px" }} />
            )}
            <p>Authorised Sign</p>
        </div>

        {/* QR */}
        <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: "700" }}>Scan To Pay</p>
            <div>
                <img src={qrCode || qrCodeImg} style={{ width: "90px", height: "90px" , margin: "0 auto" }} className="text-center" />
            </div>            
            <p style={{ fontSize: "10px", marginTop: "8px" }}>
            Dynamic QR Code will<br />be inserted here
            </p>
        </div>

        </div>


      {/* FOOTER — RIGHT GROUPED */}
      <div style={{ position: "absolute", bottom: "45px", right: "20px", display: "flex", gap: "40px", fontSize: "11px" }}>
        <span className="text-sm">{email}</span>
        <span className="text-sm">{phone}</span>
        <span className="text-sm">{website}</span>
      </div>

    </div>
  );
};

export default Template7;
