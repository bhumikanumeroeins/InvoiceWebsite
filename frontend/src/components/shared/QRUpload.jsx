import { useRef } from "react";

/**
 * Renders a QR code image or a placeholder.
 * When readOnly=false, clicking opens a file picker to upload a QR image.
 */
const QRUpload = ({
  qrImage,
  fallbackImage,
  onQRChange,
  readOnly = true,
  label = "SCAN TO PAY",
  size = 120,
}) => {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !onQRChange) return;
    const reader = new FileReader();
    reader.onloadend = () => onQRChange(reader.result);
    reader.readAsDataURL(file);
  };

  const imgEl = (
    <img
      src={qrImage || fallbackImage}
      alt="QR Code"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "block",
        margin: "0 auto",
      }}
    />
  );

  if (readOnly) {
    return (
      <div style={{ textAlign: "center" }}>
        {label && (
          <p style={{ fontWeight: "700", margin: "0 0 6px" }}>{label}</p>
        )}
        {imgEl}
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      {label && <p style={{ fontWeight: "700", margin: "0 0 6px" }}>{label}</p>}
      <div
        style={{
          display: "inline-block",
          cursor: "pointer",
          outline: "1px dashed #a5b4fc",
          borderRadius: "4px",
          padding: "4px",
          background: "rgba(79,70,229,0.04)",
        }}
        title="Click to upload QR code"
        onClick={() => inputRef.current?.click()}
      >
        {imgEl}
        <p style={{ fontSize: "10px", color: "#6366f1", margin: "2px 0 0" }}>
          click to upload
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
};

export default QRUpload;
