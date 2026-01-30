import { useState } from "react";
import { Rnd } from "react-rnd";

import bgImage from "../../../assets/templates/7_1.jpg";
import { getInvoiceData } from "../../../utils/invoiceDefaults";

import HeaderBlock from "./HeaderBlock";
import PartyTitleBlock from "./PartyTitleBlock";
import ItemsBlock from "./ItemsBlock";
import TermsTotalsBlock from "./TermsTotalsBlock";
import PaymentSignatureQRBlock from "./PaymentSignatureQRBlock";
import FooterBlock from "./FooterBlock";

const Template7 = ({ data = {}, editorMode = true }) => {
  const invoice = getInvoiceData(data);

  const [layout, setLayout] = useState({
    header: { x: 90, y: 90 },
    party: { x: 90, y: 230 },
    items: { x: 90, y: 360 },
    termsTotals: { x: 90, y: 480 },
    payment: { x: 90, y: 550 },
    footer: { x: 200, y: 750 },
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

      <Rnd bounds="parent" position={layout.header}
        onDragStop={(e, d) => update("header", d.x, d.y)}
        disableDragging={!editorMode}>
        <HeaderBlock {...invoice} />
      </Rnd>

      <Rnd bounds="parent" position={layout.party}
        onDragStop={(e, d) => update("party", d.x, d.y)}
        disableDragging={!editorMode}>
        <PartyTitleBlock {...invoice} />
      </Rnd>

      <Rnd bounds="parent" position={layout.items}
        onDragStop={(e, d) => update("items", d.x, d.y)}
        disableDragging={!editorMode}>
        <ItemsBlock items={invoice.items} />
      </Rnd>

      <Rnd bounds="parent" position={layout.termsTotals}
        onDragStop={(e, d) => update("termsTotals", d.x, d.y)}
        disableDragging={!editorMode}>
        <TermsTotalsBlock {...invoice} />
      </Rnd>

      <Rnd bounds="parent" position={layout.payment}
        onDragStop={(e, d) => update("payment", d.x, d.y)}
        disableDragging={!editorMode}>
        <PaymentSignatureQRBlock {...invoice} />
      </Rnd>

      <Rnd bounds="parent" position={layout.footer}
        onDragStop={(e, d) => update("footer", d.x, d.y)}
        disableDragging={!editorMode}>
        <FooterBlock {...invoice} />
      </Rnd>
    </div>
  );
};

export default Template7;
