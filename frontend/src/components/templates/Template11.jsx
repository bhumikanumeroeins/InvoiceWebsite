import qrCodeImg from "../../assets/templates/images (1).png";
import { getInvoiceData } from "../../utils/invoiceDefaults";

const Template11 = ({ data = {} }) => {
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

  const dark = "#24364f";
  const light = "#eef2f5";

  return (
    <div style={{
      width: "835px",
      height: "1050px",
      position: "relative",
      background: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      color: "#1f2937"
    }}>

      {/* Left Grey Panel */}
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "230px",
        height: "100%",
        background: light
      }} />

      {/* Header */}
      <div style={{
        position: "absolute",
        top: 50,
        left: 30,
        right: 60,
        display: "flex",
        justifyContent: "space-between"
      }}>
        <div>
          <h1 style={{ margin: 0 }}>LOGO</h1>
          <p style={{ fontWeight: 700, marginTop: 10 }}>{companyName}</p>
          <p style={{ whiteSpace: "pre-line", fontSize: 14 }}>{companyAddress}</p>
        </div>
        <div style={{ fontSize: 56, letterSpacing: 6, fontWeight: 300 }}>
          INVOICE
        </div>
      </div>

      {/* Invoice Info */}
      <div style={{
        position: "absolute",
        top: 160,
        right: 60,
        lineHeight: 1.8
      }}>
        <div><b>Invoice#</b> {invoiceNumber}</div>
        <div><b>Invoice Date</b> {invoiceDate}</div>
        <div><b>P.O#</b> {poNumber}</div>
        <div><b>Due Date</b> {dueDate}</div>
      </div>

      {/* Bill & Ship */}
      <div style={{
        position: "absolute",
        top: 526,
        left: 30,
        width: 200
      }}>
        <b>Bill To</b>
        <p>{billToName}</p>
        <p style={{ whiteSpace: "pre-line" }}>{billToAddress}</p>

        <div style={{ marginTop: 68 }}>
          <b>Ship To</b>
          <p>{shipToName}</p>
          <p style={{ whiteSpace: "pre-line" }}>{shipToAddress}</p>
        </div>
      </div>

      {/* Table Header */}
      <div style={{
        position: "absolute",
        top: 300,
        left: 165,
        right: 60,
        display: "flex",
        background: "#e6ecf1",
        fontWeight: 700
      }}>
        <div style={{ width: "12%", background: dark, color: "#fff", padding: 12 }}>Qty</div>
        <div style={{ width: "38%", padding: 12 }}>Description</div>
        <div style={{ width: "25%", padding: 12, textAlign: "center" }}>Unit Price</div>
        <div style={{ width: "25%", padding: 12, textAlign: "right" }}>Amount</div>
      </div>

      {/* Items */}
      <div style={{ position: "absolute", top: 348, left: 165, right: 60 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", borderBottom: "1px solid #ddd" }}>
            <div style={{ width: "12%", background: dark, color: "#fff", padding: 14 }}>{item.quantity}</div>
            <div style={{ width: "38%", padding: 14 }}>{item.description}</div>
            <div style={{ width: "25%", padding: 14, textAlign: "center" }}>{item.rate.toLocaleString("en-IN")}</div>
            <div style={{ width: "25%", padding: 14, textAlign: "right" }}>{item.amount.toLocaleString("en-IN")}</div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ position: "absolute", top: 525, right: 75, width: 260 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Sub Total</span>
          <span>{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Tax</span>
          <span>{taxAmount.toLocaleString("en-IN")}</span>
        </div>
        <div style={{ marginTop: 10, background: dark, color: "#fff", padding: 12, display: "flex", justifyContent: "space-between" }}>
          <b>Total</b>
          <b>{total.toLocaleString("en-IN")}</b>
        </div>
      </div>

      {/* Terms */}
      <div style={{
        position: "absolute",
        top: 526,
        left: 250,
        width: 300
      }}>
        <b>Terms & Conditions</b>
        {terms.map((t, i) => (
          <p key={i}>• {t}</p>
        ))}
      </div>

      {/* Payment Info */}
      <div style={{
        position: "absolute",
        top: 675,
        left: 260,
        width: 300
      }}>
        <b>Payment Info</b>
        <p><b>Bank Name:</b> {bankName}</p>
        <p><b>Account No:</b> {accountNo}</p>
        <p><b>IFSC Code:</b> {ifscCode}</p>

        <div style={{ marginTop: 30, textAlign: "center" }}>
          {signature
            ? <img src={signature} style={{ height: 40 }} />
            : <div style={{ borderBottom: "1px solid #000", width: 150, margin: "0 auto" }} />
          }
          <p>Authorised Sign</p>
        </div>
      </div>

      {/* QR */}
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
          alignItems: "center"
        }}
      >
        <b>Scan To Pay</b>

        <img
          src={qrCode || qrCodeImg}
          style={{
            width: "130px",
            margin: "10px 0"
          }}
        />

        <p style={{ fontSize: 12, textAlign: "center" }}>
          Dynamic QR Code will<br />be inserted here
        </p>
      </div>


      {/* Footer */}
      <div style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        background: dark,
        color: "#fff",
        padding: 16,
        display: "flex",
        justifyContent: "center",
        gap: 50
      }}>
        <span>{email}</span>
        <span>{phone}</span>
        <span>{website}</span>
      </div>

    </div>
  );
};

export default Template11;
