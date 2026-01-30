import { useState } from "react";
import { Rnd } from "react-rnd";

import bgImage from "../../../assets/templates/8_1.jpg";
import { getInvoiceData } from "../../../utils/invoiceDefaults";

import HeaderBlock from "./HeaderBlock";
import InvoiceTitleBlock from "./InvoiceTitleBlock";
import ItemsBlock from "./ItemsBlock";
import TermsTotalsBlock from "./TermsTotalsBlock";
import PaymentQRBlock from "./PaymentQRBlock";
import FooterBlock from "./FooterBlock";

const Template8 = ({ data = {}, editorMode = true }) => {
  const invoice = getInvoiceData(data);

  const [layout, setLayout] = useState({
    header: { x: 80, y: 36 },
    invoiceTitle: { x: 80, y: 200 },
    items: { x: 80, y: 300 },
    termsTotals: { x: 80, y: 450 },
    paymentQR: { x: 80, y: 500 },
    footer: { x: 0, y: 760 },
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
        position={layout.invoiceTitle}
        onDragStop={(e, d) => update("invoiceTitle", d.x, d.y)}
        disableDragging={!editorMode}
      >
        <InvoiceTitleBlock {...invoice} />
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

export default Template8;
