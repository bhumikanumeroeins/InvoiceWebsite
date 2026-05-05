import { useState } from "react";
import SignatureModal from "../invoice/SignatureModal";

/**
 * Renders the signature area inline on a template.
 * When readOnly=false, clicking opens the SignatureModal (draw or upload).
 * When readOnly=true, renders the signature image or a plain line.
 */
const SignatureField = ({
  signatureImage,
  onSignatureChange,
  readOnly = true,
  label = "Authorised Sign",
  lineWidth = "120px",
}) => {
  const [open, setOpen] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !onSignatureChange) return;
    const reader = new FileReader();
    reader.onloadend = () => onSignatureChange(reader.result);
    reader.readAsDataURL(file);
  };

  const signatureEl = signatureImage ? (
    <img
      src={signatureImage}
      alt="Signature"
      style={{ height: "40px", display: "block", margin: "0 auto 5px" }}
    />
  ) : (
    <div
      style={{
        borderBottom: "1px solid #000",
        width: lineWidth,
        margin: "0 auto 5px",
      }}
    />
  );

  if (readOnly) {
    return (
      <div style={{ textAlign: "center" }}>
        {signatureEl}
        <p style={{ margin: 0, fontSize: "13px" }}>{label}</p>
      </div>
    );
  }

  return (
    <>
      <div
        style={{ textAlign: "center", cursor: "pointer" }}
        title="Click to add/change signature"
        onClick={() => setOpen(true)}
      >
        <div
          style={{
            display: "inline-block",
            outline: "1px dashed #a5b4fc",
            borderRadius: "4px",
            padding: "4px 8px",
            background: "rgba(79,70,229,0.04)",
            minWidth: lineWidth,
          }}
        >
          {signatureEl}
          <p style={{ margin: 0, fontSize: "10px", color: "#6366f1" }}>
            click to sign
          </p>
        </div>
        <p style={{ margin: "4px 0 0", fontSize: "13px" }}>{label}</p>
      </div>

      <SignatureModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onUpload={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              onSignatureChange && onSignatureChange(reader.result);
            };
            reader.readAsDataURL(file);
          } else {
            // draw path — onUpload receives a synthetic event with a File
            handleUpload(e);
          }
          setOpen(false);
        }}
      />
    </>
  );
};

export default SignatureField;
