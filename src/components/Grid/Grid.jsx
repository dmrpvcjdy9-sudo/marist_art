import React from "react";
import { getImage } from "../../utils/getImage";

export default function Grid({
  items,
  selectedId,
  onSelect,
  hoveredId,
  setHovered,
  isSingle,
  toggleFavorite,   // ← nueva
  isFavorite,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isSingle
          ? "1fr"
          : "repeat(auto-fill, minmax(190px, 1fr))",
        gap: "16px",
        gridAutoRows: "1fr",
        alignItems: "stretch",
        justifyItems: isSingle ? "center" : "stretch",
      }}
    >
      {items.map((item) => {
        const isHovered = hoveredId === item.id;

        return (
          <div
  key={item.id}
  role="button"
  tabIndex={0}
  onClick={() => onSelect(item)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(item);
    }
  }}
  style={{
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxWidth: isSingle ? "400px" : "100%",
    width: "100%",
    outline: "none",
  }}
>
            {/* TARJETA */}
            <div
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                background: "var(--bg-surface)",
                boxShadow: isHovered ? "var(--shadow-card-hover)" : "var(--shadow-card)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
              }}
            >
              {/* IMAGEN */}
              <div
  style={{
    width: "100%",
    aspectRatio: "3 / 4",
    overflow: "hidden",
    background: "var(--bg-surface)",
    flexShrink: 0,
    position: "relative",
    borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
    padding: "4px",  // ← margen interno
  }}
>
              {/* ESTRELLA FAVORITO */}
<button
  onClick={(e) => {
  e.stopPropagation();
  toggleFavorite(item.id);
}}
  style={{
    position: "absolute",
    top: "6px",
    right: "6px",
    zIndex: 5,
    border: "none",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(4px)",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
    padding: 0,
    lineHeight: 1,
    color: isFavorite(item.id) ? "var(--favorite)" : "var(--text-muted)",   // ← añade esta línea
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.15s ease, color 0.15s ease",
  }}
  title={isFavorite(item.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
>
  {isFavorite(item.id) ? "★" : "☆"}
</button>
                <img
  src={getImage(item, "thumb")}
  alt={item.titulo}
  loading="eager"
  style={{
  width: "100%",
  height: "100%",
  objectFit: "contain",
  display: "block",
  borderRadius: "calc(var(--radius-lg) - 2px) calc(var(--radius-lg) - 2px) 0 0", // ajuste fino
}}
  onError={(e) => {
    // Primer fallo: reintentar una vez
    if (!e.target.dataset.retried) {
      e.target.dataset.retried = "1";
      e.target.src = getImage(item, "thumb") + "?retry=" + Date.now();
    } else {
      // Segundo fallo: mostrar placeholder
      e.target.style.display = "none";
      e.target.parentElement.style.background = "var(--border-light)";
    }
  }}
/>
              </div>

              {/* TEXTO */}
              <div
                style={{
                  padding: "10px 12px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    lineHeight: 1.2,
                    marginBottom: "4px",
                  }}
                >
                  {item.titulo}
                </div>

                {item.descripcion && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.3,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.descripcion}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}