import { useRef } from "react";

/**
 * Renders a logo image or text placeholder.
 * When readOnly=false, clicking opens a file picker to upload a new logo.
 */
const LogoUpload = ({
  logoImage,
  logoText = "LOGO",
  onLogoChange,
  readOnly = true,
  style = {},
  textStyle = {},
}) => {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !onLogoChange) return;
    const reader = new FileReader();
    reader.onloadend = () => onLogoChange(reader.result);
    reader.readAsDataURL(file);
  };

  const content = logoImage ? (
    <img
      src={logoImage}
      alt="Logo"
      style={{
        maxHeight: "60px",
        maxWidth: "160px",
        objectFit: "contain",
        ...style,
      }}
    />
  ) : (
    <span style={textStyle}>{logoText}</span>
  );

  if (readOnly) return content;

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
      }}
      title="Click to upload logo"
      onClick={() => inputRef.current?.click()}
    >
      <span
        style={{
          outline: "1px dashed #a5b4fc",
          borderRadius: "2px",
          padding: "2px 4px",
          background: "rgba(79,70,229,0.05)",
          display: "inline-block",
        }}
      >
        {content}
      </span>
      <span
        style={{
          fontSize: "10px",
          color: "#6366f1",
          display: "block",
          textAlign: "center",
          marginTop: "2px",
        }}
      >
        click to change
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </span>
  );
};

export default LogoUpload;
