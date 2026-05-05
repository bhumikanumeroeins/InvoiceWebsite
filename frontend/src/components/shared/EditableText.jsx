import { useState, useRef } from "react";

/**
 * A span that becomes an input on click when readOnly is false.
 * - Always has a minimum clickable area so empty fields can be re-clicked.
 * - Shows placeholder text when empty and editable.
 * - Constrained to container width — never overflows horizontally.
 */
const EditableText = ({
  value,
  onChange,
  style,
  className,
  placeholder,
  readOnly = true,
  multiline = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef(null);

  const commit = () => {
    setIsEditing(false);
    if (onChange) onChange(tempValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !multiline) {
      e.preventDefault();
      commit();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setTempValue(value);
    }
  };

  if (isEditing && !readOnly) {
    const inputStyle = {
      ...style,
      border: "2px solid #4F46E5",
      outline: "none",
      background: "white",
      padding: "2px 4px",
      borderRadius: "2px",
      // Fill container width, never overflow
      width: "100%",
      maxWidth: "100%",
      boxSizing: "border-box",
      display: "block",
      color: "#1f2937",
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: "inherit",
      lineHeight: "inherit",
    };

    return multiline ? (
      <textarea
        ref={inputRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        autoFocus
        rows={3}
        style={inputStyle}
        className={className}
      />
    ) : (
      <input
        ref={inputRef}
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        autoFocus
        style={inputStyle}
        className={className}
      />
    );
  }

  // Empty = no value, or value is only whitespace (e.g. space set by AddItemButton)
  const isEmpty = !value || value.trim() === "";

  return (
    <span
      onClick={() => {
        if (!readOnly) {
          setIsEditing(true);
          setTempValue(value);
        }
      }}
      onMouseEnter={() => {
        if (!readOnly) setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...style,
        cursor: readOnly ? "default" : "pointer",
        padding: "2px 4px",
        borderRadius: "2px",
        transition: "background 0.15s",
        background:
          !readOnly && isHovered ? "rgba(79,70,229,0.08)" : "transparent",
        // Show dashed outline on hover OR when empty — signals the field is editable
        outline:
          !readOnly && (isHovered || isEmpty) ? "1px dashed #a5b4fc" : "none",
        // Prevent overflow
        display: "inline-block",

        // Minimum clickable area — critical so empty fields can always be clicked
        minHeight: readOnly ? undefined : "1.4em",
        minWidth: readOnly ? undefined : "30px",
      }}
      className={className}
      title={readOnly ? undefined : "Click to edit"}
    >
      {isEmpty && !readOnly ? (
        // Visible placeholder so user knows the field is editable
        <span
          style={{
            color: "#9ca3af",
            fontStyle: "italic",
            fontWeight: "normal",
            pointerEvents: "none",
          }}
        >
          {placeholder || "Click to edit"}
        </span>
      ) : (
        value || ""
      )}
    </span>
  );
};

export default EditableText;
