import { useState } from "react";
import { Rnd } from "react-rnd";

import { getInvoiceData } from "../../../utils/invoiceDefaults";

import HeaderBlock from "./HeaderBlock";
import PartyBlock from "./PartyBlock";
import ItemsBlock from "./ItemsBlock";
import TermsTotalsBlock from "./TermsTotalsBlock";
import PaymentQRBlock from "./PaymentQRBlock";
import FooterBlock from "./FooterBlock";

const Template10 = ({ data = {}, editorMode = true }) => {
  const invoice = getInvoiceData(data);

  const [layout, setLayout] = useState({
    header: { x: 0, y: 0 },
    party: { x: 80, y: 150 },
    items: { x: 80, y: 250 },
    termsTotals: { x: 80, y: 400 },
    paymentQR: { x: 80, y: 500 },
    footer: { x: 0, y: 700 },
  });

  const update = (k, x, y) =>
    setLayout((p) => ({ ...p, [k]: { x, y } }));

  return (
    <div
      style={{
        width: 794,
        height: 1050,
        position: "relative",
        overflow: "hidden",
        background: "#fff",
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

      {/* PARTY */}
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

      {/* PAYMENT */}
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

export default Template10;
