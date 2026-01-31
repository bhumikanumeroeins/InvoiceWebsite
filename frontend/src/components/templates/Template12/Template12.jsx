import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

import bg from "../../../assets/templates/12_1.png";
import { getInvoiceData } from "../../../utils/invoiceDefaults";

import HeaderBlock from "./HeaderBlock";
import PartyBlock from "./PartyBlock";
import InvoiceTitleBlock from "./InvoiceTitleBlock";
import MetaBlock from "./MetaBlock";
import ItemsBlock from "./ItemsBlock";
import TermsTotalsBlock from "./TermsTotalsBlock";
import PaymentBlock from "./PaymentBlock";
import QRBlock from "./QRBlock";
import ThankYouBlock from "./ThankYouBlock";

const Template12 = ({ data = {}, editorMode = true, backendLayout, templateId, onLayoutChange }) => {
  const invoice = getInvoiceData(data);
  const bgUrl = bg;

  const DEFAULT_LAYOUT = {
    header: { x: 250, y: 10 },
    party: { x: 140, y: 60 },
    title: { x: 460, y: 120 },
    meta: { x: 130, y: 220 },
    items: { x: 90, y: 290 },
    termsTotals: { x: 120, y: 420 },
    payment: { x: 120, y: 500 },
    qr: { x: 350, y: 520 },
    thankyou: { x: 250, y: 680 },
  };

  const [layout, setLayout] = useState(backendLayout || DEFAULT_LAYOUT);

  useEffect(() => {
    console.log("Template12 - backendLayout received:", backendLayout);
    console.log("Template12 - templateId:", templateId);
    if (backendLayout) {
      console.log("Template12 - Applying backend layout:", backendLayout);
      setLayout(backendLayout);
    }
  }, [backendLayout, templateId]);

  const update = (k, x, y) => {
    const newLayout = { ...layout, [k]: { x, y } };
    console.log("Template12 - Layout updated:", newLayout);
    setLayout(newLayout);
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
  };

  return (
    <div
      style={{
        width: "835px",
        height: "1050px",
        position: "relative",
        fontFamily: "'DM Sans', sans-serif",
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

      <Rnd
        bounds="parent"
        position={layout.header}
        onDragStop={(e, d) => update("header", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <HeaderBlock {...invoice} />
      </Rnd>

      <Rnd
        bounds="parent"
        position={layout.party}
        onDragStop={(e, d) => update("party", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <PartyBlock {...invoice} />
      </Rnd>

      <Rnd
        bounds="parent"
        position={layout.title}
        onDragStop={(e, d) => update("title", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <InvoiceTitleBlock />
      </Rnd>

      <Rnd
        bounds="parent"
        position={layout.meta}
        onDragStop={(e, d) => update("meta", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <MetaBlock {...invoice} />
      </Rnd>

      <Rnd
        bounds="parent"
        position={layout.items}
        onDragStop={(e, d) => update("items", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <ItemsBlock items={invoice.items} />
      </Rnd>

      <Rnd
        bounds="parent"
        position={layout.termsTotals}
        onDragStop={(e, d) =>
          update("termsTotals", d.x, d.y)
        }
        disableDragging={!editorMode}
      >
        <TermsTotalsBlock {...invoice} />
      </Rnd>

      <Rnd
        bounds="parent"
        position={layout.payment}
        onDragStop={(e, d) => update("payment", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <PaymentBlock {...invoice} />
      </Rnd>

      <Rnd
        bounds="parent"
        position={layout.qr}
        onDragStop={(e, d) => update("qr", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <QRBlock qrCode={invoice.qrCode} />
      </Rnd>

      <Rnd
        bounds="parent"
        position={layout.thankyou}
        onDragStop={(e, d) => update("thankyou", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <ThankYouBlock />
      </Rnd>
    </div>
  );
};

export default Template12;
