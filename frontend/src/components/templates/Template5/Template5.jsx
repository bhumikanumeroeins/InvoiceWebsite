import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

import bgImage from "../../../assets/templates/5_1.jpg";
import { getInvoiceData } from "../../../utils/invoiceDefaults";

import HeaderBlock from "./HeaderBlock";
import InvoiceDetailsBlock from "./InvoiceDetailsBlock";
import ItemsBlock from "./ItemsBlock";
import TermsTotalsBlock from "./TermsTotalsBlock";
import PaymentQRBlock from "./PaymentQRBlock";
import FooterBlock from "./FooterBlock";

const Template5 = ({ data = {}, editorMode = true, backendLayout, templateId, onLayoutChange }) => {
  const bgUrl = bgImage;

  const invoice = getInvoiceData(data);

  const DEFAULT_LAYOUT = {
    header: { x: 80, y: -50 },
    details: { x: 90, y: 290 },
    items: { x: 80, y: 330 },
    termsTotals: { x: 30, y: 600 },
    paymentQR: { x: 200, y: 690 },
    footer: { x: 80, y: 750 },
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

  const update = (k, x, y) => {
    const newLayout = {
      ...layout,
      [k]: { x, y },
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
        position={layout.details}
        onDragStop={(e, d) => update("details", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <InvoiceDetailsBlock {...invoice} />
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
        onDragStop={(e, d) => update("termsTotals", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <TermsTotalsBlock {...invoice} />
      </Rnd>

      <Rnd
        bounds="parent"
        position={layout.paymentQR}
        onDragStop={(e, d) => update("paymentQR", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <PaymentQRBlock {...invoice} />
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
  );
};

export default Template5;
