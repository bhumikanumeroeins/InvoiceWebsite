import { AlignCenter } from "lucide-react";
import qrCodeImg from "../../assets/templates/images (1).png";
import { getInvoiceData } from "../../utils/invoiceDefaults";

const Template9 = ({ data = {} }) => {
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

  const navy = "#1f2552";
  const yellow = "#ffc21c";

  return (
    <div
      style={{
        width: "794px",
        height: "965px",
        position: "relative",
        background: "#ffffff",
        fontFamily: "'Open Sans', sans-serif",
        color: "#1f2552"
      }}
    >

      {/* LOGO + COMPANY */}
      <div style={{ position: "absolute", top: "40px", left: "80px", right: "80px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "'Bebas Neue'", fontSize: "32px", margin: 0 }}>LOGO</p>
        </div>

        <div style={{ textAlign: "right" }}>
          <p style={{ fontWeight: "700", margin: 0 }}>{companyName}</p>
          <p style={{ margin: 0, whiteSpace: "pre-line" }}>{companyAddress}</p>
        </div>
      </div>

      {/* INVOICE PILL */}
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
          letterSpacing: "2px"
        }}
      >
        INVOICE
      </div>

      {/* BILL / SHIP / INVOICE INFO */}
      <div style={{ position: "absolute", top: "200px", left: "80px", right: "80px", display: "flex", justifyContent: "space-between" }}>
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

        <div style={{ lineHeight: "1.7" }}>
            <div><b className="inline-block min-w-[120px]">Invoice#:</b><span>{invoiceNumber}</span></div>
            <div><b className="inline-block min-w-[120px]">Invoice Date:</b><span>{invoiceDate}</span></div>
            <div><b className="inline-block min-w-[120px]">P.O#:</b><span>{poNumber}</span></div>
            <div><b className="inline-block min-w-[120px]">Due Date:</b><span>{dueDate}</span></div>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ position: "absolute", top: "340px", left: "0px", right: "80px" }}>
        <div style={{ display: "flex", background: yellow, padding: "12px 12px 12px 50px", fontWeight: "700" }}>
          <div style={{ width: "10%", textAlign: "center" }}>Qty</div>
          <div style={{ width: "45%" }}>Description</div>
          <div style={{ width: "20%", textAlign: "center" }}>Unit Price</div>
          <div style={{ width: "25%", textAlign: "right" }}>Amount</div>
        </div>

        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", padding: "14px 14px 14px 50px", borderBottom: "1px solid #d1d5db" }}>
            <div style={{ width: "10%", textAlign: "center" }}>{item.quantity}</div>
            <div style={{ width: "45%" }}>{item.description}</div>
            <div style={{ width: "20%", textAlign: "center" }}>{item.rate.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
            <div style={{ width: "25%", textAlign: "right" }}>{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
          </div>
        ))}
      </div>

      {/* TERMS + TOTAL */}
      <div style={{ position: "absolute", top: "570px", left: "80px", right: "80px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p className="font-medium uppercase text-xl" style={{fontFamily: 'Bebas Neue'}}>Terms and Conditions</p>
          {terms.map((t, i) => <p key={i}>◆ {t}</p>)}
        </div>

        <div style={{ fontWeight: "700" }}>
            <div>
                <span className="inline-block min-w-[60px]" style={{ fontFamily: "Bebas Neue" }}>
                Subtotal :
                </span>
                <span style={{ color: "#000" }}>
                {subtotal.toLocaleString("en-IN")}
                </span>
            </div>

            <div>
                <span className="inline-block min-w-[60px]" style={{ fontFamily: "Bebas Neue" }}>
                Tax :
                </span>
                <span style={{ color: "#000" }}>
                {taxAmount.toLocaleString("en-IN")}
                </span>
            </div>

            <div style={{ fontSize: "20px" }}>
                <span className="inline-block min-w-[60px]" style={{ fontFamily: "Bebas Neue" }}>
                Total :
                </span>
                <span style={{ color: "#000" }}>
                {total.toLocaleString("en-IN")}
                </span>
            </div>
            </div>

      </div>

      {/* PAYMENT + QR */}
      <div style={{ position: "absolute", top: "710px", left: "80px", right: "80px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p className="font-medium text-xl" style={{ fontFamily: "Bebas Neue" }}>Payment Info</p>
          <div><span className="inline-block min-w-[105px] font-medium">Bank Name: </span>{accountNo}</div>
          <div><span className="inline-block min-w-[105px] font-medium">Account No: </span>{bankName}</div>
          <div><span className="inline-block min-w-[105px] font-medium">IFSC Code: </span>{ifscCode}</div>

          <div style={{ marginTop: "30px", textAlign: "center" }}>
            {signature ? <img src={signature} style={{ height: "40px" }} /> : <div style={{ borderBottom: "1px solid #000", width: "120px", margin: "0 auto" }} />}
            <p>Authorised Sign</p>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <p className="font-bold">Scan To Pay</p>
          <img src={qrCode || qrCodeImg} style={{ width: "100px", height: "100px" }} />
          <p style={{ fontSize: "11px" }}>Dynamic QR Code will<br />be inserted here</p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ position: "absolute", bottom: 0, width: "100%", background: navy, color: "#fff", padding: "15px 0", display: "flex", justifyContent: "center", gap: "50px", fontSize: "13px" }}>
        <span>{email}</span>
        <span>{phone}</span>
        <span>{website}</span>
      </div>

    </div>
  );
};

export default Template9;
