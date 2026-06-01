import React from "react";

export default function AboutPanel({
  isOpen,
  onToggle,
  hovered,
  onHover,
  onLeave,
  t,
}) {
  const aboutText = t("infopanels.aboutText");

  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => onHover("left")}
      onMouseLeave={() => onLeave(null)}
      style={{
        flex: "1 1 360px",
        minWidth: "280px",
        background: "var(--bg-surface)",
        borderRadius: "14px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        height: isOpen ? "auto" : "100px",
        boxShadow: hovered === "left"
          ? "0 12px 28px rgba(0,0,0,0.15)"
          : "0 4px 12px rgba(0,0,0,0.08)",
        transform: hovered === "left" ? "scale(1.01)" : "scale(1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "18px 20px 6px",
          fontStyle: "italic",
          color: "#1e3a5f",
          fontSize: "18px",
          fontWeight: "500",
          lineHeight: 1.2,
          flexShrink: 0,
        }}
      >
        {t("infopanels.aboutTitle")}
      </div>

      <div
        style={{
          padding: "0 20px 20px",
          color: "var(--text-secondary)",
          fontSize: "13px",
          lineHeight: 1.5,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: isOpen ? "unset" : 3,
          WebkitBoxOrient: "vertical",
          position: "relative",
          whiteSpace: "pre-line",
          textAlign: "left",
        }}
      >
        {isOpen ? (
          aboutText.split("\n\n").map((p, i) => (
            <p key={i} style={{ margin: "0 0 12px" }}>
              {p}
            </p>
          ))
        ) : (
          <div style={{ position: "relative" }}>
            <span style={{ display: "block" }}>{aboutText}</span>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40px",
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.9), rgba(255,255,255,1))",
                pointerEvents: "none",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}