import bgImage from '../../assets/templates/6_1.jpg';
import qrFallback from "../../assets/templates/images (1).png";
import { getInvoiceData } from "../../utils/invoiceDefaults";

const Template6 = ({ data = {} }) => {
  const {
    logo, companyName, companyAddress,
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
      className="w-[794px] h-[1123px] relative font-[Poppins] font-[Fira_Sans] bg-no-repeat bg-top"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "794px 1123px" }}
    >

      {/* HEADER */}
      <div className="px-[50px] pt-[60px] text-white">
        <div className="flex justify-between items-start">
          <div>
            {logo ? (
              <img src={logo} className="h-10 mb-2" />
            ) : (
              <p className="text-3xl font-bold tracking-widest">LOGO</p>
            )}
            <p className='text-sm opacity-80 mt-6'>{companyName}</p>
            <h5 className="text-lg">{companyAddress}</h5>
          </div>
        </div>
      </div>

      {/* BILL / SHIP / INVOICE */}
      <div className="px-[50px] mt-[70px] grid grid-cols-3 gap-6 text-sm">
        <div>
          <p className="font-medium">Bill To</p>
          <p className="font-semibold">{billToName}</p>
          <p className="font-semibold whitespace-pre-line">{billToAddress}</p>
        </div>

        <div>
          <p className="font-medium">Ship To</p>
          <p className="font-semibold">{shipToName}</p>
          <p className="font-semibold whitespace-pre-line">{shipToAddress}</p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold font-[Fira_Sans]">INVOICE</p>
          <p><span className='font-semibold'>Invoice#:</span> {invoiceNumber}</p>
          <p><span className='font-semibold'>Invoice Date:</span> {invoiceDate}</p>
          <p><span className='font-semibold'>IP.O#:</span> {poNumber}</p>
          <p><span className='font-semibold'>Due Date:</span> {dueDate}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="px-[50px] mt-10">
        <div className="grid grid-cols-[80px_1fr_140px_140px] bg-gray-100 px-4 py-3 font-semibold text-sm">
          <div>QTY</div>
          <div>DESCRIPTION</div>
          <div className="text-center">UNIT PRICE</div>
          <div className="text-right">AMOUNT</div>
        </div>

        {items.map((i, idx) => (
          <div key={idx} className="grid grid-cols-[80px_1fr_140px_140px] px-4 py-3 border-b text-sm">
            <div> {i.quantity}</div>
            <div> {i.description}</div>
            <div className="text-center"> {i.rate.toLocaleString("en-IN")}</div>
            <div className="text-right"> {i.amount.toLocaleString("en-IN")}</div>
          </div>
        ))}
      </div>

      {/* TERMS + TOTAL */}
      <div className="px-[50px] mt-8 flex justify-between text-sm">
        <div className="w-[50%]">
          <p className="font-bold mb-2">Terms and Conditions</p>
          {terms.map((t, i) => (
            <p key={i}>▪ {t}</p>
          ))}
        </div>

        <div className="w-[35%] pr-3">
          <div className="flex justify-between mb-2">
            <span>Sub Total</span><span className='font-semibold'>{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax</span><span className='font-bold'>{taxAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span><span className='font-bold'>{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* PAYMENT + QR */}
      <div className="px-[50px] mt-10 flex justify-between items-end text-sm">
        <div>
          <p className="font-bold mb-2">Payment Info</p>
          <p><span className='font-semibold'>Bank Name:</span> {bankName}</p>
          <p><span className='font-semibold'>Account No:</span> {accountNo}</p>
          <p><span className='font-semibold'>IFSC Code:</span> {ifscCode}</p>

          <div className="mt-6">
            {signature ? <img src={signature} className="h-10" /> : <div className="w-32 border-b h-10" />}
            <p className="font-semibold mt-1">Authorised Sign</p>
          </div>
        </div>

        <div className="text-center">
          <p className="font-bold">Scan To Pay</p>
          <img src={qrCode || qrFallback} className="w-28 h-28 mx-auto mt-2" />
          <p className="text-xs mt-1 text-center leading-tight">
            Dynamic QR Code will <br />
            be inserted here
          </p>
        </div>
      </div>

      {/* THANK YOU */}
      <p className="absolute bottom-[155px] right-[20px] font-semibold text-lg leading-tight text-center">
        Thank You For Your <br/> Business
      </p>

      {/* FOOTER */}
      <div className="absolute bottom-6 left-0 right-0 px-[50px] flex justify-between text-white text-xs font-[Fira_Sans]">
        <span>{phone}</span>
        <span>{email}</span>
        <span>{website}</span>
      </div>
    </div>
  );
};

export default Template6;
