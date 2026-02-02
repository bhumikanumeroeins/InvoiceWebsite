import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

import bgImage from "../../../assets/templates/3_1.png";
import { getInvoiceData } from "../../../utils/invoiceDefaults";

import HeaderBlock from "./HeaderBlock";
import PartyBlock from "./PartyBlock";
import InvoiceDetailsBlock from "./InvoiceDetailsBlock";
import ItemsBlock from "./ItemsBlock";
import TermsPaymentBlock from "./TermsPaymentBlock";
import TotalsQRBlock from "./TotalsQRBlock";
import FooterBlock from "./FooterBlock";

const Template3 = ({ data = {}, editorMode = true, backendLayout, templateId, onLayoutChange }) => {
  const bgUrl = bgImage;

  const invoice = getInvoiceData(data);

  const DEFAULT_LAYOUT = {
    header: { x: 0, y: 0 },
    party: { x: 0, y: 110 },
    details: { x: 0, y: 230 },
    items: { x: 0, y: 210 },
    terms: { x: 50, y: 700 },
    totals: { x: 420, y: 450 },
    footer: { x: 50, y: 650 },
  };

  const [layout, setLayout] = useState(
    backendLayout || DEFAULT_LAYOUT
  );

  useEffect(() => {
    if (
      backendLayout &&
      Object.keys(backendLayout).length > 0
    ) {
      console.log("✅ Applying backend layout:", backendLayout);
      setLayout(backendLayout);
    }
  }, [backendLayout]);

  const updatePos = (key, x, y) => {
    const newLayout = {
      ...layout,
      [key]: { x, y },
    };

    setLayout(newLayout);

    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
  };

  console.log("🧭 current layout state:", layout);

  return (
    <div
      style={{
        width: "794px",
        height: "1123px",
        position: "relative",
        overflow: "hidden",
        background: "#fff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Background */}
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

      {/* HEADER */}
      <Rnd
        bounds="parent"
        size={{ width: 700 }}
        position={layout.header}
        disableDragging={!editorMode}
        onDragStop={(e, d) => updatePos("header", d.x, d.y)}
      >
        <HeaderBlock {...invoice} />
      </Rnd>

      {/* BILL / SHIP */}
      <Rnd
        bounds="parent"
        size={{ width: 700 }}
        position={layout.party}
        disableDragging={!editorMode}
        onDragStop={(e, d) => updatePos("party", d.x, d.y)}
      >
        <PartyBlock {...invoice} />
      </Rnd>

      {/* INVOICE DETAILS */}
      <Rnd
        bounds="parent"
        size={{ width: 700 }}
        position={layout.details}
        disableDragging={!editorMode}
        onDragStop={(e, d) => updatePos("details", d.x, d.y)}
      >
        <InvoiceDetailsBlock {...invoice} />
      </Rnd>

      {/* ITEMS */}
      <Rnd
        bounds="parent"
        size={{ width: 700 }}
        position={layout.items}
        disableDragging={!editorMode}
        onDragStop={(e, d) => updatePos("items", d.x, d.y)}
      >
        <ItemsBlock items={invoice.items} />
      </Rnd>

      {/* TERMS + PAYMENT */}
      <Rnd
        bounds="parent"
        size={{ width: 300 }}
        position={layout.terms}
        disableDragging={!editorMode}
        onDragStop={(e, d) => updatePos("terms", d.x, d.y)}
      >
        <TermsPaymentBlock {...invoice} />
      </Rnd>

      {/* TOTALS + QR */}
      <Rnd
        bounds="parent"
        size={{ width: 300 }}
        position={layout.totals}
        disableDragging={!editorMode}
        onDragStop={(e, d) => updatePos("totals", d.x, d.y)}
      >
        <TotalsQRBlock {...invoice} />
      </Rnd>

      {/* FOOTER */}
      <Rnd
        bounds="parent"
        size={{ width: 700 }}
        position={layout.footer}
        disableDragging={!editorMode}
        onDragStop={(e, d) => updatePos("footer", d.x, d.y)}
      >
        <FooterBlock {...invoice} />
      </Rnd>
    </div>
  );
};

export default Template3;
