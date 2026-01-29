import { useState } from "react";
import { Rnd } from "react-rnd";

import bgImage from "../../../assets/templates/4_1.jpg";
import { getInvoiceData } from "../../../utils/invoiceDefaults";

import HeaderBlock from "./HeaderBlock";
import InvoiceDetailsBlock from "./InvoiceDetailsBlock";
import ItemsBlock from "./ItemsBlock";
import PartyTotalsBlock from "./PartyTotalsBlock";
import TermsPaymentQRBlock from "./TermsPaymentQRBlock";
import FooterBlock from "./FooterBlock";

const Template4 = ({ data = {}, editorMode = true }) => {
  const invoice = getInvoiceData(data);

  const [layout, setLayout] = useState({
    header: { x: 0, y: 80 },
    details: { x: 430, y: 90 },
    items: { x: 0, y: 280 },
    partyTotals: { x: 0, y: 580 },
    termsQR: { x: 0, y: 760 },
    footer: { x: 0, y: 980 },
  });

  const update = (k, x, y) =>
    setLayout((p) => ({ ...p, [k]: { x, y } }));

  return (
    <div
      style={{
        width: 794,
        height: 1123,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={bgImage}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
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
        position={layout.partyTotals}
        onDragStop={(e, d) => update("partyTotals", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <PartyTotalsBlock {...invoice} />
      </Rnd>

      <Rnd
        bounds="parent"
        position={layout.termsQR}
        onDragStop={(e, d) => update("termsQR", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <TermsPaymentQRBlock {...invoice} />
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

export default Template4;
