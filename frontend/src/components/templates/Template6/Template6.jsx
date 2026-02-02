import { useState, useEffect } from "react";
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

const Template6 = ({ data = {}, editorMode = true, backendLayout, templateId, onLayoutChange }) => {
  const invoice = getInvoiceData(data);
  const bgUrl = bgImage;

  const DEFAULT_LAYOUT = {
    header: { x: 0, y: -50 },
    party: { x: 50, y: 230 },
    items: { x: 50, y: 290 },
    termsTotals: { x: 50, y: 650 },
    paymentQR: { x: 50, y: 750 },
    thankyou: { x: 550, y: 950 },
    footer: { x: 0, y: 760 },
  };

  const [layout, setLayout] = useState(backendLayout || DEFAULT_LAYOUT);

  useEffect(() => {
    console.log("Template6 - backendLayout received:", backendLayout);
    console.log("Template6 - templateId:", templateId);
    if (backendLayout) {
      console.log("Template6 - Applying backend layout:", backendLayout);
      setLayout(backendLayout);
    }
  }, [backendLayout, templateId]);

  const update = (k, x, y) => {
    const newLayout = { ...layout, [k]: { x, y } };
    console.log("Template6 - Layout updated:", newLayout);
    setLayout(newLayout);
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
  };

  return (
    <div
      style={{
        width: "794px",
        height: "1123px",
        position: "relative",
        overflow: "hidden",
        background: "white",
      }}
    >
      <img
        src={bgUrl}
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
