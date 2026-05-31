import React from "react";

export default function AboutPanel({
  isOpen,
  onToggle,
  hovered,
  onHover,
  onLeave,
}) {
  const leftText = `
Me llamo Arturo Morales, laico marista de Champagnat, y formo parte de la Provincia Marista Mediterránea.

Además de mi tarea habitual (educador y catequista) a menudo suelo crear diseños e ilustraciones, o adaptarlos a formato digital, para lo propio de nuestras acciones pastorales, educativas, vocacionales, sociales y comunitarias. Trabajo con archivos vectoriales por su versatilidad.

Este espacio tiene una finalidad sencilla: servir de repositorio de imágenes relacionadas con esas acciones, que se va actualizando. Son copias en PNG de los originales e incluye adaptaciones de ilustraciones encontradas por la red o que han compartido conmigo. En esos casos, aparecerá en el título y, si lo he localizado, citando el origen. Una mención especial merece C_Towers, amigo y artista nato de brocha y ceras.

Todo el contenido se comparte bajo licencia Creative Commons BY-NC 4.0. (Consulta el aviso legal para más detalles), sin marcas de agua y descargable, esperando que sirva para inspirar o ayudar en vuestras tareas. Compártelo cuanto veas.

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
        Presentación
      </div>

      {/* CONTENIDO */}
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
          <>
            {leftText.split("\n\n").map((p, i) => (
              <p key={i} style={{ margin: "0 0 12px" }}>
                {p}
              </p>
            ))}
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