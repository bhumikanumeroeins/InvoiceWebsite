import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

import { getInvoiceData } from "../../../utils/invoiceDefaults";

import HeaderBlock from "./HeaderBlock";
import InvoicePillBlock from "./InvoicePillBlock";
import PartyBlock from "./PartyBlock";
import ItemsBlock from "./ItemsBlock";
import TermsTotalsBlock from "./TermsTotalsBlock";
import PaymentQRBlock from "./PaymentQRBlock";
import FooterBlock from "./FooterBlock";

const Template9 = ({ data = {}, editorMode = true, backendLayout, templateId, onLayoutChange }) => {
  const invoice = getInvoiceData(data);

  const DEFAULT_LAYOUT = {
    header: { x: 80, y: 40 },
    pill: { x: 0, y: 110 },
    party: { x: 80, y: 200 },
    items: { x: 0, y: 300 },
    termsTotals: { x: 80, y: 450 },
    paymentQR: { x: 80, y: 520 },
    footer: { x: 0, y: 650 },
  };

  const [layout, setLayout] = useState(backendLayout || DEFAULT_LAYOUT);

  useEffect(() => {
    console.log("Template9 - backendLayout received:", backendLayout);
    console.log("Template9 - templateId:", templateId);
    if (backendLayout) {
      console.log("Template9 - Applying backend layout:", backendLayout);
      setLayout(backendLayout);
    }
  }, [backendLayout, templateId]);

  const update = (k, x, y) => {
    const newLayout = { ...layout, [k]: { x, y } };
    console.log("Template9 - Layout updated:", newLayout);
    setLayout(newLayout);
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
  };

  return (
    <div
      style={{
        width: "794px",
        height: "965px",
        position: "relative",
        overflow: "hidden",
        background: "#fff",
        fontFamily: "'Open Sans', sans-serif",
        color: "#1f2552",
      }}
    >
      {/* HEADER */}
      <Rnd
        bounds="parent"
        position={layout.header}
        onDragStop={(e, d) => update("header", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <HeaderBlock {...invoice} />
      </Rnd>

      {/* INVOICE PILL */}
      <Rnd
        bounds="parent"
        position={layout.pill}
        onDragStop={(e, d) => update("pill", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <InvoicePillBlock />
      </Rnd>

      {/* BILL / SHIP / INFO */}
      <Rnd
        bounds="parent"
        position={layout.party}
        onDragStop={(e, d) => update("party", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <PartyBlock {...invoice} />
      </Rnd>

      {/* ITEMS */}
      <Rnd
        bounds="parent"
        position={layout.items}
        onDragStop={(e, d) => update("items", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <ItemsBlock items={invoice.items} />
      </Rnd>

      {/* TERMS + TOTAL */}
      <Rnd
        bounds="parent"
        position={layout.termsTotals}
        onDragStop={(e, d) => update("termsTotals", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <TermsTotalsBlock {...invoice} />
      </Rnd>

      {/* PAYMENT + QR */}
      <Rnd
        bounds="parent"
        position={layout.paymentQR}
        onDragStop={(e, d) => update("paymentQR", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <PaymentQRBlock {...invoice} />
      </Rnd>

      {/* FOOTER */}
      <Rnd
        bounds="parent"
        position={layout.footer}
        onDragStop={(e, d) => update("footer", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <FooterBlock {...invoice} />
      </Rnd>
    </div>
  );
};

export default Template9;
