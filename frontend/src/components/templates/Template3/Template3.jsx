import { useState } from "react";
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

const Template3 = ({ data = {}, editorMode = true }) => {
  const invoice = getInvoiceData(data);

  const [layout, setLayout] = useState({
    header: { x: 0, y: 20 },
    party: { x: 0, y: 100 },
    details: { x: 0, y: 200 },
    items: { x: 0, y: 260 },
    terms: { x: 50, y: 440 },
    totals: { x: 420, y: 420 },
    footer: { x: 50, y: 650 },
  });

  const updatePos = (key, x, y) => {
    setLayout((p) => ({
      ...p,
      [key]: { ...p[key], x, y },
    }));
  };

  return (
    <div
      style={{
        width: 794,
        height: 1123,
        position: "relative",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "794px 1123px",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
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
