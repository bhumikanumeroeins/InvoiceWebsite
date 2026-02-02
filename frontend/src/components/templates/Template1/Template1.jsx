import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

import bgImage from "../../../assets/templates/1_1.jpg";
import { getInvoiceData } from "../../../utils/invoiceDefaults";

import HeaderBlock from "./HeaderBlock";
import ItemsBlock from "./ItemsBlock";
import TotalsBlock from "./TotalsBlock";
import PaymentBlock from "./PaymentBlock";
import FooterBlock from "./FooterBlock";



const Template1 = ({ data = {}, editorMode = true , backendLayout,  templateId, onLayoutChange}) => {

const bgUrl = bgImage;




  const invoice = getInvoiceData(data);

  const DEFAULT_LAYOUT = {
      header: { x: 0, y: 0 },
      items: { x: 0, y: 150 },
      totals: { x: 0, y: 400 },
      payment: { x: 0, y: 550 },
      footer: { x: 0, y: 750 },
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
        position={layout.header}
        onDragStop={(e, d) => updatePos("header", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <HeaderBlock {...invoice} />
      </Rnd>

      {/* ITEMS */}
      <Rnd
        bounds="parent"
        position={layout.items}
        onDragStop={(e, d) => updatePos("items", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <ItemsBlock items={invoice.items} />
      </Rnd>

      {/* TOTALS */}
      <Rnd
        bounds="parent"
        position={layout.totals}
        onDragStop={(e, d) => updatePos("totals", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <TotalsBlock
          subtotal={invoice.subtotal}
          taxAmount={invoice.taxAmount}
          total={invoice.total}
          terms={invoice.terms}
        />
      </Rnd>

      {/* PAYMENT */}
      <Rnd
        bounds="parent"
        position={layout.payment}
        onDragStop={(e, d) => updatePos("payment", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <PaymentBlock {...invoice} />
      </Rnd>

      {/* FOOTER */}
      <Rnd
        bounds="parent"
        position={layout.footer}
        onDragStop={(e, d) => updatePos("footer", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <FooterBlock {...invoice} />
      </Rnd>
    </div>
  );
};

export default Template1;
