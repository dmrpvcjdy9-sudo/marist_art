import React from "react";

export default function Filters({ filters, setFilters, options }) {
  if (filters.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        padding: "10px 20px",
        alignItems: "center",
      }}
    >
      {filters.map((filter) => (
        <span
          key={filter}
          onClick={() =>
            setFilters((prev) => prev.filter((f) => f !== filter))
          }
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: "var(--font-primary)",
          }}
        >
          {filter}
          <span style={{ fontSize: "11px", opacity: 0.7 }}>✕</span>
        </span>
      ))}
    </div>
  );
}