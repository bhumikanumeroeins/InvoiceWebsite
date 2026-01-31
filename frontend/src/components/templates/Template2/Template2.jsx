import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

import bgImage from "../../../assets/templates/1_4.jpeg";
import { getInvoiceData } from "../../../utils/invoiceDefaults";

import HeaderBlock from "./HeaderBlock";
import PartyBlock from "./PartyBlock";
import ItemsBlock from "./ItemsBlock";
import TermsPaymentBlock from "./TermsPaymentBlock";
import TotalsQRBlock from "./TotalsQRBlock";
import FooterBlock from "./FooterBlock";

const Template2 = ({ data = {}, editorMode = true, backendLayout, templateId, onLayoutChange }) => {
  const bgUrl = bgImage;

  const invoice = getInvoiceData(data);

  const DEFAULT_LAYOUT = {
    header: { x: 380, y: 30 },
    party: { x: 60, y: 250 },
    items: { x: 60, y: 320 },
    terms: { x: 60, y: 550 },
    totals: { x: 380, y: 550 },
    footer: { x: 0, y: 780 },
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
        size={{ width: 300, height: "auto" }}
        position={layout.header}
        onDragStop={(e, d) => updatePos("header", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <HeaderBlock {...invoice} />
      </Rnd>

      {/* PARTY */}
      <Rnd
        bounds="parent"
        size={{ width: 675, height: "auto" }}
        position={layout.party}
        onDragStop={(e, d) => updatePos("party", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <PartyBlock {...invoice} />
      </Rnd>

      {/* ITEMS */}
      <Rnd
        bounds="parent"
        size={{ width: 675, height: "auto" }}
        position={layout.items}
        onDragStop={(e, d) => updatePos("items", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <ItemsBlock items={invoice.items} />
      </Rnd>

      {/* TERMS / PAYMENT */}
      <Rnd
        bounds="parent"
        size={{ width: 300, height: "auto" }}
        position={layout.terms}
        onDragStop={(e, d) => updatePos("terms", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <TermsPaymentBlock {...invoice} />
      </Rnd>

      {/* TOTALS / QR */}
      <Rnd
        bounds="parent"
        size={{ width: 300, height: "auto" }}
        position={layout.totals}
        onDragStop={(e, d) => updatePos("totals", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <TotalsQRBlock {...invoice} />
      </Rnd>

      {/* FOOTER */}
      <Rnd
        bounds="parent"
        size={{ width: 794, height: "auto" }}
        position={layout.footer}
        onDragStop={(e, d) => updatePos("footer", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <FooterBlock {...invoice} />
      </Rnd>
    </div>
  );
};

export default Template2;
