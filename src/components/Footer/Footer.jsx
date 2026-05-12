import React from "react";

export default function Footer({ onLogoClick }) {
  return (
    <div
      style={{
        background: "rgb(11, 47, 55)",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "11px",
          fontWeight: "300",
          fontStyle: "italic",
        }}
      >
        © AMP 2026
      </div>

      <img
        src="/logo.png"
        alt="Marist-Art"
        style={{
          height: "32px",
          objectFit: "contain",
          cursor: "pointer",
          opacity: 0.7,
          transition: "opacity 0.2s ease",
          filter: "brightness(0) invert(1)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.7)}
        onClick={onLogoClick}
      />
    </div>
  );
}