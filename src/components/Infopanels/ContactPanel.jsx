import React, { useState, useEffect } from "react";

export default function ContactPanel({
  isOpen,
  onToggle,
  hovered,
  onHover,
  onLeave,
  t,
}) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sent) {
      const timeout = setTimeout(() => setSent(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [sent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);

    const formData = new FormData(e.target);

    const res = await fetch("https://formspree.io/f/mnjlgkyw", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      setSent(true);
      e.target.reset();
    }

    setLoading(false);
  };

  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => onHover("right")}
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
        boxShadow: hovered === "right"
          ? "0 12px 28px rgba(0,0,0,0.15)"
          : "0 4px 12px rgba(0,0,0,0.08)",
        transform: hovered === "right" ? "scale(1.01)" : "scale(1)",
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
        {t("infopanels.contactTitle")}
      </div>

      <div
        style={{
          padding: "0 20px 20px",
          color: "var(--text-secondary)",
          fontSize: "13px",
          lineHeight: 1.5,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {isOpen ? (
          <>
            <p style={{ margin: "12px 0 16px" }}>
              {t("infopanels.contactText")}
            </p>

            <form
              onSubmit={handleSubmit}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxWidth: "320px",
              }}
            >
              <input
                type="email"
                name="email"
                placeholder={t("infopanels.emailPlaceholder")}
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
              <textarea
                name="message"
                placeholder={t("infopanels.messagePlaceholder")}
                required
                rows={4}
                style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 16px",
                  borderRadius: "6px",
                  border: "1px solid var(--accent)",
                  background: "var(--bg-surface)",
                  color: "var(--accent)",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.color = "var(--bg-surface)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--bg-surface)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
              >
                {loading ? t("infopanels.sending") : t("infopanels.send")}
              </button>
              {sent && (
                <div
                  role="status"
                  aria-live="polite"
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "var(--accent)",
                    fontStyle: "italic",
                  }}
                >
                  {t("infopanels.sent")}
                </div>
              )}
            </form>
          </>
        ) : (
          <div style={{ position: "relative" }}>
            <span style={{ display: "block" }}>
              {t("infopanels.contactText")}
            </span>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40px",
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
                pointerEvents: "none",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid #e5e5e5",
  fontSize: "13px",
  fontFamily: "var(--font-primary)",
  outline: "none",
  color: "var(--text-primary)",
  background: "var(--bg-surface)",
  transition: "border-color 0.2s ease",
};