import React from "react";

export default function Footer({ onLogoClick }) {
  return (
    <div
      style={{
        background: "var(--bg-footer)",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "var(--text-light-muted)",
    fontSize: "11px",
    fontWeight: "300",
    fontStyle: "italic",
  }}
>
  <span>© AMP 2026</span>
  <span style={{ opacity: 0.4 }}>|</span>
  <span>CC BY-NC 4.0</span>
  <a href="/data/notaslegales.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
  Aviso legal
</a>
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