import React from "react";

export default function Footer({ onLogoClick, t }) {
  return (
    <div
      style={{
        background: "var(--bg-footer)",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        flexWrap: "wrap",
        gap: "12px",
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
          flexWrap: "wrap",
        }}
      >
        <span>© AMP 2026</span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span>{t("footer.cc")}</span>
        <a
          href="/data/notaslegales.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          {t("footer.avisoLegal")}
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