import bgImage from "../../assets/templates/8_1.jpg";
import qrCodeImg from "../../assets/templates/images (1).png";
import { getInvoiceData } from "../../utils/invoiceDefaults";

const Template8 = ({ data = {} }) => {
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

  const purple = "#3b2d4a";
  const cream = "#fdeccd";

  return (
    <div
      style={{
        width: "794px",
        height: "1123px",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "794px 1123px",
        backgroundRepeat: "no-repeat",
        position: "relative",
        fontFamily: "'Cabin', sans-serif",
        color: "#2f2a3a"
      }}
    >

      {/* HEADER */}
      <div style={{ position: "absolute", top: "36px", left: "80px", right: "80px", display: "flex", justifyContent: "space-between", color: "#fff" }}>
        <div>
          <p style={{ fontFamily: "'Dela Gothic One'", fontSize: "24px", margin: 0 }}>LOGO</p>
          <p style={{ fontSize: "22px", fontWeight: "700", marginTop: "10px" }}>{companyName}</p>
          <p style={{ fontSize: "14px", whiteSpace: "pre-line" }}>{companyAddress}</p>
        </div>

        <div>
          <p style={{ fontSize: "18px" }} className="font-extrabold">Bill To</p>
          <p>{billToName}</p>
          <p style={{ whiteSpace: "pre-line" }}>{billToAddress}</p>
        </div>

        <div>
          <p style={{ fontSize: "18px" }} className="font-extrabold">Ship To</p>
          <p>{shipToName}</p>
          <p style={{ whiteSpace: "pre-line" }}>{shipToAddress}</p>
        </div>
      </div>

      {/* INVOICE INFO + TITLE */}
        <div
        style={{
            position: "absolute",
            top: "200px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start"
        }}
        >
        {/* LEFT — Invoice details */}
        <div style={{ fontSize: "14px", lineHeight: "1.7" }}>
            <div>
                <span className="inline-block min-w-[105px]">Invoice# :</span><b>{invoiceNumber}</b>
            </div>
            <div>
                <span className="inline-block min-w-[105px]">Invoice Date: </span><b>{invoiceDate}</b>
            </div>
            <div>
                <span className="inline-block min-w-[105px]">P.O#: </span><b>{poNumber}</b>
            </div>
            <div>
                <span className="inline-block min-w-[105px]">Due Date: </span><b>{dueDate}</b>
            </div>
        </div>

        {/* RIGHT — INVOICE text */}
        <div
            style={{
            fontFamily: "'Dela Gothic One'",
            fontSize: "56px",
            color: purple,
            lineHeight: "1"
            }}
        >
            INVOICE
        </div>
        </div>


      {/* TABLE */}
      <div style={{ position: "absolute", top: "345px", left: "80px", right: "80px" }}>
        <div style={{ display: "flex", background: cream, padding: "12px 20px", borderRadius: "30px", fontWeight: "700" }}>
          <div style={{ width: "10%" }}>Qty</div>
          <div style={{ width: "45%" }}>Description</div>
          <div style={{ width: "20%", textAlign: "center" }}>Unit Price</div>
          <div style={{ width: "25%", textAlign: "right" }}>Amount</div>
        </div>

        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", padding: "12px 20px", background: i === 1 ? cream : "transparent", borderRadius: "30px", marginTop: "6px" }}>
            <div style={{ width: "10%" }}>{item.qty}</div>
            <div style={{ width: "45%" }}>{item.description}</div>
            <div style={{ width: "20%", textAlign: "center" }}>{item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
            <div style={{ width: "25%", textAlign: "right" }}>{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
          </div>
        ))}
      </div>

      {/* TERMS & TOTAL */}
      <div style={{ position: "absolute", top: "600px", left: "80px", right: "80px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontWeight: "700" }}>Terms & Conditions</p>
          {terms.map((t, i) => <p key={i}>• {t}</p>)}
        </div>

        <div>
            <div><b className="inline-block min-w-[80px]">Sub total:</b><span className="font-semibold">{subtotal.toLocaleString("en-IN")}</span></div>
            <div><b className="inline-block min-w-[80px]">Tax:</b><span className="font-semibold">{taxAmount.toLocaleString("en-IN")}</span></div>
            <div><b className="inline-block min-w-[80px]">Total:</b><span className="font-semibold">{total.toLocaleString("en-IN")}</span></div>
        </div>
      </div>

      {/* Payment & QR */}
      <div style={{ position: "absolute", top: "720px", left: "80px", right: "80px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontWeight: "700" }}>Payment Info</p>
          <div><b className="inline-block min-w-[60px]">Bank: </b><span></span>{bankName}</div>
          <div><b className="inline-block min-w-[60px]">Account: </b><span></span>{accountNo}</div>
          <div><b className="inline-block min-w-[60px]">IFSC: </b><span></span>{ifscCode}</div>

          <div style={{ marginTop: "40px", textAlign: "center" }}>
            {signature ? <img src={signature} style={{ height: "40px" }} /> : <div style={{ borderBottom: "1px solid #000", width: "120px", margin: "0 auto" }} />}
            <p>Authorised Sign</p>
          </div>
        </div>

        <div style={{ background: cream, padding: "20px", textAlign: "center" }}>
          <p style={{ fontWeight: "700" }}>Scan To Pay</p>
          <img src={qrCode || qrCodeImg} style={{ width: "100px", height: "100px" }} />
          <p style={{ fontSize: "10px" }}>Dynamic QR Code will<br />be inserted here</p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ position: "absolute", bottom: "25px", width: "100%", display: "flex", justifyContent: "center", gap: "40px", color: "#fff", fontSize: "12px" }}>
        <span className="text-lg">{email}</span>
        <span className="text-lg">{phone}</span>
        <span className="text-lg">{website}</span>
      </div>

    </div>
  );
};

export default Template8;
