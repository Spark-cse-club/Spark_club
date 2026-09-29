import { useRef, useState } from "react";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

export default function ImageUpload({
  multiple = false,
  maxFiles = 4,
  value,         // existing URL(s) for preview
  onChange,      // called with File or File[]
  label = "Upload Image",
}) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    const arr = Array.from(files);
    const limited = multiple ? arr.slice(0, maxFiles) : [arr[0]];
    const urls = limited.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    onChange(multiple ? limited : limited[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const clear = () => {
    setPreviews([]);
    onChange(multiple ? [] : null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayPreviews = previews.length > 0 ? previews : (value ? (Array.isArray(value) ? value : [value]) : []);

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? "var(--accent)" : "var(--border-strong)"}`,
          borderRadius: "var(--radius-md)",
          padding: "1.5rem",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "var(--accent-bg)" : "var(--bg-tertiary)",
          transition: "var(--transition)",
        }}
      >
        <FiUpload size={24} style={{ color: "var(--accent)", marginBottom: "0.5rem" }} />
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
          {label} — drag & drop or click
        </p>
        {multiple && (
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
            Max {maxFiles} images
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {displayPreviews.length > 0 && (
        <div style={{ marginTop: "0.75rem", position: "relative" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: displayPreviews.length === 1 ? "1fr" : "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "0.5rem",
          }}>
            {displayPreviews.map((src, i) => (
              <div key={i} style={{ position: "relative", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                <img src={src} alt="" style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} />
              </div>
            ))}
          </div>
          {previews.length > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clear(); }}
              style={{
                position: "absolute", top: -8, right: -8,
                width: 24, height: 24,
                background: "#ef4444", color: "white",
                border: "none", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 12,
              }}
            >
              <FiX size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
