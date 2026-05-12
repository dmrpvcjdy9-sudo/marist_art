import React from "react";

export default function AboutPanel({
  isOpen,
  onToggle,
  hovered,
  onHover,
  onLeave,
}) {
  const leftText = `
Me llamo Arturo Morales Pérez, soy laico marista de Champagnat, y formo parte de la Provincia Marista Mediterránea.

Además de mi tarea habitual (educador y catequista) a menudo suelo crear diseños e ilustraciones, o adaptarlos a formato digital, para lo propio de nuestras acciones pastorales, educativas, vocacionales, sociales y comunitarias.

Esta web/app tiene una finalidad sencilla: servir de repositorio de imágenes que he podido ir creando o vectorizando, relacionadas con esos fines. Se incluyen adaptaciones de dibujos o ilustraciones encontradas por la red o que han compartido conmigo. En esos casos, aparecerá "adaptada" en el título y, siempre que lo haya encontrado, citando el autor de la imagen o fragmento adaptado.

No es por tanto un estudio de diseño online ni una web de compras o marketing, ni siquiera una página personal como artista. Todo es abierto (licencia Creative Commons, ver Nota Legal), y descargable, esperando que sirva para inspirar o ayudar en vuestras tareas.

Encantado de veros por aquí.
`;

  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => onHover("left")}
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
        boxShadow: hovered === "left"
          ? "0 12px 28px rgba(0,0,0,0.15)"
          : "0 4px 12px rgba(0,0,0,0.08)",
        transform: hovered === "left" ? "scale(1.01)" : "scale(1)",
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
        Presentación y Nota Legal
      </div>

      {/* CONTENIDO */}
      <div
        style={{
          padding: "0 20px 20px",
          color: "#5c5c5c",
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
          <>
            {leftText.split("\n\n").map((p, i) => (
              <p key={i} style={{ margin: "0 0 12px" }}>
                {p}
              </p>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              <a
                href="/data/notaslegales.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  padding: "8px 18px",
                  borderRadius: "6px",
                  border: "1px solid #7b5ea7",
                  background: "#ffffff",
                  color: "#7b5ea7",
                  fontSize: "12px",
                  fontWeight: "500",
                  textDecoration: "none",
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
                Aviso Legal
              </a>
            </div>
          </>
        ) : (
          <div style={{ position: "relative" }}>
            <span style={{ display: "block" }}>{leftText}</span>
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