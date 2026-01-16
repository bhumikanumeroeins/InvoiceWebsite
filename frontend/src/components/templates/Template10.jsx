import qrCodeImg from "../../assets/templates/images (1).png";
import { getInvoiceData } from "../../utils/invoiceDefaults";

const Template10 = ({ data = {} }) => {
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

  const dark = "#2f343a";
  const grey = "#8c8f92";

  return (
    <div
      style={{
        width: "794px",
        height: "1050px",
        position: "relative",
        background: "#ffffff",
        fontFamily: "'Open Sans', sans-serif",
        color: "#1f2937"
      }}
    >

      {/* ================= HEADER ================= */}
      <div style={{ background: grey, color: "#fff", padding: "40px 80px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>LOGO</p>
          <p style={{ fontWeight: "700", marginTop: "10px" }}>{companyName}</p>
          <p style={{ whiteSpace: "pre-line", fontSize: "14px" }}>{companyAddress}</p>
        </div>

        <div style={{ fontSize: "70px", letterSpacing: "4px", fontWeight: "300" }}>
          INVOICE
        </div>
      </div>

      <div
        style={{
          height: "6px",
          background: "rgb(47, 52, 58)"
        }}
      />

      {/* Rainbow line */}
      <div
        style={{
          height: "6px",
          background: "linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)"
        }}
      />

      {/* ================= BILL / SHIP / INFO ================= */}
      <div style={{ position: "absolute", top: "225px", left: "80px", right: "80px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p className="font-bold">Bill To</p>
          <p>{billToName}</p>
          <p style={{ whiteSpace: "pre-line" }}>{billToAddress}</p>
        </div>

        <div>
          <p className="font-bold">Ship To</p>
          <p>{shipToName}</p>
          <p style={{ whiteSpace: "pre-line" }}>{shipToAddress}</p>
        </div>

        <div style={{ lineHeight: "1.8" }}>
          <div><b className="inline-block min-w-[110px]">Invoice#:</b>{invoiceNumber}</div>
          <div><b className="inline-block min-w-[110px]">Invoice Date:</b>{invoiceDate}</div>
          <div><b className="inline-block min-w-[110px]">P.O#:</b>{poNumber}</div>
          <div><b className="inline-block min-w-[110px]">Due Date:</b>{dueDate}</div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div style={{ position: "absolute", top: "360px", left: "80px", right: "80px" }}>
        <div style={{ height: "5px", background: "rgb(140, 143, 146)" }} />
        <div style={{ display: "flex", background: dark, color: "#fff", padding: "12px" }}>
          <div style={{ width: "10%" }} className="font-medium">Qty</div>
          <div style={{ width: "45%" }} className="font-medium">Description</div>
          <div style={{ width: "20%", textAlign: "center" }} className="font-medium">Unit Price</div>
          <div style={{ width: "25%", textAlign: "right" }} className="font-medium">Amount</div>
        </div>

        <div style={{ height: "5px", background: "linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)" }} />

        {items.map((item, i) => (
            <div
                key={i}
                style={{
                display: "flex",
                borderBottom: "1px solid #d1d5db"
                }}
            >
                {/* Qty */}
                <div style={{ width: "10%", padding: "14px", background: "#f3f3f3", fontWeight: "700" }}>
                {item.qty}
                </div>

                {/* Description */}
                <div style={{ width: "45%", padding: "14px", background: "#ffffff" }}>
                {item.description}
                </div>

                {/* Unit Price */}
                <div style={{ width: "20%", padding: "14px", background: "#f3f3f3", textAlign: "center" }}>
                {item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>

                {/* Amount */}
                <div style={{ width: "25%", padding: "14px", background: "#ffffff", textAlign: "right" }}>
                {item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
            </div>
            ))}
      </div>

      {/* ================= TERMS & TOTAL ================= */}
      <div style={{ position: "absolute", top: "620px", left: "80px", right: "80px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p className="font-bold">Terms and Conditions</p>
          {terms.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                
                {/* Rainbow diamond */}
                <span
                style={{
                    width: "10px",
                    height: "10px",
                    transform: "rotate(45deg)",
                    background: "linear-gradient(135deg, red, orange, yellow, green, cyan, blue, violet)",
                    display: "inline-block"
                }}
                />

                <span>{t}</span>
            </div>
            ))}
        </div>

        <div style={{ minWidth: "250px" }}>
            
          <div><b className="uppercase inline-block min-w-[175px]">Subtotal:</b><span>{subtotal.toLocaleString("en-IN")}</span></div>
          <div><b className="uppercase inline-block min-w-[175px]">Tax:</b><span>{taxAmount.toLocaleString("en-IN")}</span> </div>

          {/* Grey strip above total */}
            <div
            style={{
                height: "10px",
                background: "#9ca3af",   
                marginTop: "12px"
            }}
            />

            {/* Total bar */}
            <div
                style={{
                    background: dark,
                    color: "#fff",
                    padding: "12px",
                    fontWeight: "700"
                }}
            >
            <b className="uppercase inline-block min-w-[150px]">Total:</b> <span>{total.toLocaleString("en-IN")}</span>
            </div>

            {/* Rainbow strip below */}
            <div
            style={{
                height: "4px",
                background: "linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)"
            }}
            />


        
          <div style={{ height: "4px", background: "linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)" }} />
        </div>
      </div>

      {/* ================= PAYMENT + QR ================= */}
      <div style={{ position: "absolute", top: "760px", left: "80px", right: "140px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p className="font-bold">Payment Info</p>
          <div><span className="font-semibold inline-block min-w-[100px]">Bank Name:</span> <span>{bankName}</span></div>
          <div><span className="font-semibold inline-block min-w-[100px]">Account No:</span> <span>{accountNo}</span></div>
          <div><span className="font-semibold inline-block min-w-[100px]">IFSC Code:</span> <span>{ifscCode}</span></div>

          <div style={{ marginTop: "30px", textAlign: "center" }}>
            {signature ? <img src={signature} style={{ height: "40px" }} /> : <div style={{ borderBottom: "1px solid #000", width: "120px", margin: "0 auto" }} />}
            <p>Authorised Sign</p>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <p className="font-bold">SCAN TO PAY</p>
          <img src={qrCode || qrCodeImg} style={{ width: "120px", height: "120px" }} />
          <p style={{ fontSize: "12px" }}>Dynamic QR Code will<br />be inserted here</p>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div style={{ position: "absolute", bottom: 0, width: "100%", background: dark, color: "#fff", padding: "15px 0", display: "flex", justifyContent: "center", gap: "50px" }}>
        <span>{email}</span>
        <span>{phone}</span>
        <span>{website}</span>
      </div>

    </div>
  );
};

export default Template10;
