import { useState } from "react";
import { Rnd } from "react-rnd";

import bgImage from "../../../assets/templates/1_4.jpeg";
import { getInvoiceData } from "../../../utils/invoiceDefaults";

import HeaderBlock from "./HeaderBlock";
import PartyBlock from "./PartyBlock";
import ItemsBlock from "./ItemsBlock";
import TermsPaymentBlock from "./TermsPaymentBlock";
import TotalsQRBlock from "./TotalsQRBlock";
import FooterBlock from "./FooterBlock";

const Template2 = ({ data = {}, editorMode = true }) => {
  const invoice = getInvoiceData(data);

  const [layout, setLayout] = useState({
    header: { x: 380, y: 30 },
    party: { x: 60, y: 250 },
    items: { x: 60, y: 320 },
    terms: { x: 60, y: 450 },
    totals: { x: 380, y: 690 },
    footer: { x: 0, y: 980 },
  });

  const updatePos = (key, x, y) => {
    setLayout((prev) => ({
      ...prev,
      [key]: { ...prev[key], x, y },
    }));
  };

  return (
    <div
      style={{
        width: 794,
        height: 1123,
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "794px 1123px",
      }}
    >
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
