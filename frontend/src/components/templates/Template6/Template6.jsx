import { useState } from "react";
import { Rnd } from "react-rnd";

import bgImage from "../../../assets/templates/6_1.jpg";
import { getInvoiceData } from "../../../utils/invoiceDefaults";

import HeaderBlock from "./HeaderBlock";
import PartyInvoiceBlock from "./PartyInvoiceBlock";
import ItemsBlock from "./ItemsBlock";
import TermsTotalsBlock from "./TermsTotalsBlock";
import PaymentQRBlock from "./PaymentQRBlock";
import ThankYouBlock from "./ThankYouBlock";
import FooterBlock from "./FooterBlock";

const Template6 = ({ data = {}, editorMode = true }) => {
  const invoice = getInvoiceData(data);

  const [layout, setLayout] = useState({
    header: { x: 0, y: 0 },
    party: { x: 50, y: 160 },
    items: { x: 50, y: 270 },
    termsTotals: { x: 50, y: 400 },
    paymentQR: { x: 50, y: 500 },
    thankyou: { x: 400, y: 650 },
    footer: { x: 0, y: 760 },
  });


  const update = (k, x, y) =>
    setLayout((p) => ({ ...p, [k]: { x, y } }));

  return (
    <div
      style={{
        width: 794,
        height: 1123,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={bgImage}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

        <Rnd bounds="parent" position={layout.header}
          onDragStop={(e,d)=>update("header",d.x,d.y)}
          disableDragging={!editorMode}>
          <HeaderBlock {...invoice} />
        </Rnd>

        <Rnd bounds="parent" position={layout.party}
          onDragStop={(e,d)=>update("party",d.x,d.y)}
          disableDragging={!editorMode}>
          <PartyInvoiceBlock {...invoice} />
        </Rnd>

        <Rnd bounds="parent" position={layout.items}
          onDragStop={(e,d)=>update("items",d.x,d.y)}
          disableDragging={!editorMode}>
          <ItemsBlock items={invoice.items} />
        </Rnd>

        <Rnd bounds="parent" position={layout.termsTotals}
          onDragStop={(e,d)=>update("termsTotals",d.x,d.y)}
          disableDragging={!editorMode}>
          <TermsTotalsBlock {...invoice} />
        </Rnd>

        <Rnd bounds="parent" position={layout.paymentQR}
          onDragStop={(e,d)=>update("paymentQR",d.x,d.y)}
          disableDragging={!editorMode}>
          <PaymentQRBlock {...invoice} />
        </Rnd>

        <Rnd bounds="parent" position={layout.thankyou}
          onDragStop={(e,d)=>update("thankyou",d.x,d.y)}
          disableDragging={!editorMode}>
          <ThankYouBlock />
        </Rnd>

        <Rnd bounds="parent" position={layout.footer}
          onDragStop={(e,d)=>update("footer",d.x,d.y)}
          disableDragging={!editorMode}>
          <FooterBlock {...invoice} />
        </Rnd>

    </div>
  );
};

export default Template6;
