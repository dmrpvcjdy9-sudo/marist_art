import React, { useState, useEffect } from "react";

export default function ContactPanel({
  isOpen,
  onToggle,
  hovered,
  onHover,
  onLeave,
}) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sent) {
      const t = setTimeout(() => setSent(false), 4000);
      return () => clearTimeout(t);
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
        background: "#ffffff",
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
      {/* TÍTULO */}
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
        Consulta y Contacto
      </div>

      {/* CONTENIDO */}
      <div
        style={{
          padding: "0 20px 20px",
          color: "#5c5c5c",
          fontSize: "13px",
          lineHeight: 1.5,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {isOpen ? (
          <>
            <p style={{ margin: "12px 0 16px" }}>
              Si tienes cualquier duda, consulta o aportación, puedes hacerlo desde aquí. Tus datos sólo se usarán para este fin.
            </p>

            {/* FORMULARIO */}
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
                placeholder="Tu email"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#7b5ea7")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
              />
              <textarea
                name="message"
                placeholder="Mensaje"
                required
                rows={4}
                style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
                onFocus={(e) => (e.target.style.borderColor = "#7b5ea7")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 16px",
                  borderRadius: "6px",
                  border: "1px solid #7b5ea7",
                  background: "#ffffff",
                  color: "#7b5ea7",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#7b5ea7";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.color = "#7b5ea7";
                }}
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
              {sent && (
                <div
                  role="status"
                  aria-live="polite"
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "#7b5ea7",
                    fontStyle: "italic",
                  }}
                >
                  ✔ Mensaje enviado correctamente
                </div>
              )}
            </form>
          </>
        ) : (
          <div style={{ position: "relative" }}>
            <span style={{ display: "block" }}>
              Si tienes cualquier duda, consulta o aportación, puedes hacerlo desde aquí. Tus datos sólo se usarán para este fin.
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
  fontFamily: "'Montserrat', sans-serif",
  outline: "none",
  color: "#1a1a1a",
  background: "#ffffff",
  transition: "border-color 0.2s ease",
};