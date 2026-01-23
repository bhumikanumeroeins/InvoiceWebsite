import bg from "../../assets/templates/12_1.png";   
import qrCodeImg from "../../assets/templates/images (1).png";
import { getInvoiceData } from "../../utils/invoiceDefaults";

const Template12 = ({ data = {} }) => {
  const {
    companyName, companyAddress,
    billToName, billToAddress,
    shipToName, shipToAddress,
    invoiceNumber, invoiceDate, poNumber, dueDate,
    items, terms, subtotal, taxAmount, total,
    bankName, accountNo, ifscCode,
    signature, qrCode
  } = getInvoiceData(data);

  const teal = "#2bb6b1";

  return (
    <div
      style={{
        width: "835px",
        height: "1050px",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        padding: "40px 50px",
        boxSizing: "border-box"
      }}
    >
      {/* Force DM Sans everywhere */}
      <div style={{ fontFamily: "'DM Sans', sans-serif", height: "100%" }}>

        {/* LOGO */}
        <div style={{ textAlign: "center", fontSize: 28, fontWeight: 700 }}>
          LOGO
        </div>

        {/* TOP INFO */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
          <div>
            <b>{companyName}</b>
            <p style={{ whiteSpace: "pre-line" }}>{companyAddress}</p>
          </div>

          <div>
            <b>Bill To</b>
            <p>{billToName}</p>
            <p style={{ whiteSpace: "pre-line" }}>{billToAddress}</p>
          </div>

          <div>
            <b>Ship To</b>
            <p>{shipToName}</p>
            <p style={{ whiteSpace: "pre-line" }}>{shipToAddress}</p>
          </div>
        </div>

        {/* INVOICE TITLE */}
        <div
          style={{
            position: "absolute",
            top: 260,
            left: "69%",
            transform: "translateX(-50%)",
            fontSize: 65,
            fontWeight: 700,
            color: "#434343",
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          invoice.
        </div>

        {/* META */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 150 }}>
          {[
            ["Invoice#", invoiceNumber],
            ["Invoice Date", invoiceDate],
            ["P.O#", poNumber],
            ["Due Date", dueDate]
          ].map(([label, value], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  background: teal,
                  color: "#fff",
                  padding: "10px 22px",
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif"
                }}
              >
                {label}
              </div>
              <div style={{ marginTop: 8, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", background: teal, color: "#fff", padding: 12, fontWeight: 600 }}>
            <div style={{ width: "10%" }}>Qty</div>
            <div style={{ width: "40%" }}>Description</div>
            <div style={{ width: "25%", textAlign: "center" }}>Unit Price</div>
            <div style={{ width: "25%", textAlign: "right" }}>Amount</div>
          </div>

          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", padding: 12 }}>
              <div style={{ width: "10%" }}>{item.quantity}</div>
              <div style={{ width: "40%" }}>{item.description}</div>
              <div style={{ width: "25%", textAlign: "center" }}>{item.rate}</div>
              <div style={{ width: "25%", textAlign: "right" }}>{item.amount}</div>
            </div>
          ))}
        </div>

        {/* TERMS + TOTAL */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
          <div>
            <b>Terms & Conditions</b>
            {terms.map((t, i) => <p key={i}>■ {t}</p>)}
          </div>

          <div style={{ width: 260 }}>

            {/* Subtotal */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                <span style={{ minWidth: 90 }}>Subtotal</span>
                <div style={{ flex: 1, height: 2, background: teal, margin: "0 10px" }} />
                <span>{subtotal}</span>
            </div>

            {/* Tax */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
                <span style={{ minWidth: 90 }}>Tax</span>
                <div style={{ flex: 1, height: 2, background: teal, margin: "0 10px" }} />
                <span>{taxAmount}</span>
            </div>

            {/* Total */}
            <div
                style={{
                background: teal,
                color: "#fff",
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700
                }}
            >
                <span>Total</span>
                <span>{total}</span>
            </div>

            </div>

        </div>

        {/* PAYMENT + QR */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
          <div>
            <b>Payment Info</b>
            <p><b>Bank Name:</b> {bankName}</p>
            <p><b>Account No:</b> {accountNo}</p>
            <p><b>IFSC Code:</b> {ifscCode}</p>

            <div style={{ marginTop: 20 }}>
              {signature && <img src={signature} style={{ height: 40 }} />}
              <p>Authorised Sign</p>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <b>Scan To Pay</b>
            <p style={{ fontSize: 12 }}>(Dynamic QR will be inserted here)</p>
            <img src={qrCode || qrCodeImg} style={{ width: 120, marginTop: 10 }} />
          </div>
        </div>

        {/* THANK YOU */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            width: "100%",
            textAlign: "center",
            fontWeight: 700,
            letterSpacing: 1,
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          THANK YOU FOR YOUR BUSINESS
        </div>

      </div>
    </div>
  );
};

export default Template12;
