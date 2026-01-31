import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

import { getInvoiceData } from "../../../utils/invoiceDefaults";

import HeaderBlock from "./HeaderBlock";
import InvoiceInfoBlock from "./InvoiceInfoBlock";
import PartyBlock from "./PartyBlock";
import ItemsBlock from "./ItemsBlock";
import TermsBlock from "./TermsBlock";
import TotalsBlock from "./TotalsBlock";
import PaymentBlock from "./PaymentBlock";
import QRBlock from "./QRBlock";
import FooterBlock from "./FooterBlock";

const Template11 = ({ data = {}, editorMode = true, backendLayout, templateId, onLayoutChange }) => {
  const invoice = getInvoiceData(data);

  const DEFAULT_LAYOUT = {
    header: { x: 30, y: 50 },
    invoiceInfo: { x: 500, y: 120 },
    party: { x: 30, y: 350 },
    items: { x: 110, y: 220 },
    terms: { x: 180, y: 350 },
    totals: { x: 350, y: 350 },
    payment: { x: 180, y: 450 },
    qr: { x: 350, y: 450 },
    footer: { x: 0, y: 700 },
  };

  const [layout, setLayout] = useState(backendLayout || DEFAULT_LAYOUT);

  useEffect(() => {
    console.log("Template11 - backendLayout received:", backendLayout);
    console.log("Template11 - templateId:", templateId);
    if (backendLayout) {
      console.log("Template11 - Applying backend layout:", backendLayout);
      setLayout(backendLayout);
    }
  }, [backendLayout, templateId]);

  const update = (k, x, y) => {
    const newLayout = { ...layout, [k]: { x, y } };
    console.log("Template11 - Layout updated:", newLayout);
    setLayout(newLayout);
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
  };

  return (
    <div
      style={{
        width: "794px",
        height: "1050px",
        position: "relative",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      {/* LEFT COLOR PANEL */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 230,
          height: "100%",
          background: "#eef2f5",
          zIndex: 1,
        }}
      />

      {/* CONTENT LAYER */}
      <div style={{ position: "relative", zIndex: 2 }}>
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
          position={layout.invoiceInfo}
          onDragStop={(e, d) => update("invoiceInfo", d.x, d.y)}
          disableDragging={!editorMode}
        >
          <InvoiceInfoBlock {...invoice} />
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
          position={layout.items}
          onDragStop={(e, d) => update("items", d.x, d.y)}
          disableDragging={!editorMode}
        >
          <ItemsBlock items={invoice.items} />
        </Rnd>

        <Rnd
          bounds="parent"
          position={layout.terms}
          onDragStop={(e, d) => update("terms", d.x, d.y)}
          disableDragging={!editorMode}
        >
          <TermsBlock terms={invoice.terms} />
        </Rnd>

        <Rnd
          bounds="parent"
          position={layout.totals}
          onDragStop={(e, d) => update("totals", d.x, d.y)}
          disableDragging={!editorMode}
        >
          <TotalsBlock {...invoice} />
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
          position={layout.footer}
          onDragStop={(e, d) => update("footer", d.x, d.y)}
          disableDragging={!editorMode}
        >
          <FooterBlock {...invoice} />
        </Rnd>
      </div>
    </div>
  );
};

export default Template11;
