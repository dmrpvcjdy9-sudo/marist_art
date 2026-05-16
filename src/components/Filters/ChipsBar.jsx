import React from "react";

export default function ChipsBar({
  activeFilters,
  toggleFilter,
  clearFilters,
  clearFavorites,
  isMobile,
  favoritesCount,
  filteredCount,
  onOpenDrawer,
}) {
  const isFavoritesActive = activeFilters.includes("__favoritos__");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#ffffff",
        padding: "8px 20px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      {/* CHIP FAVORITOS */}
      <span
        onClick={() => toggleFilter("__favoritos__")}
        style={{
          padding: "6px 12px",
          borderRadius: "999px",
          border: isFavoritesActive ? "1px solid #4caf50" : "1px solid #e5e5e5",
          background: isFavoritesActive ? "#e8f5e9" : "#ffffff",
          color: isFavoritesActive ? "#2e7d32" : "#5c5c5c",
          fontSize: "11px",
          fontWeight: "600",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all 0.15s ease",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        ⭐ {favoritesCount || 0}
      </span>

      {/* PAPELERA DE FAVORITOS */}
      {favoritesCount > 0 && (
  <button
    onClick={() => {
      if (window.confirm("¿Borrar todos los favoritos?")) {
        clearFavorites();
        clearFilters();
      }
    }}
    title="Borrar todos los favoritos"
          style={{
            border: "none",
            background: "transparent",
            color: "#999999",
            fontSize: "15px",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "6px",
            flexShrink: 0,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#e74c3c";
            e.currentTarget.style.background = "#fef0f0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#999999";
            e.currentTarget.style.background = "transparent";
          }}
        >
          🗑
        </button>
      )}

      {/* Espaciador */}
      <div style={{ flex: 1 }} />

{/* Contador de resultados */}
<span
  style={{
    fontSize: "12px",
    color: "#999999",
    fontStyle: "italic",
    fontFamily: "'Montserrat', sans-serif",
    whiteSpace: "nowrap",
    marginRight: "8px",
  }}
>
  {filteredCount} resultado{filteredCount === 1 ? "" : "s"}
</span>

      {/* Botón "+ Filtros" */}
      <button
        onClick={onOpenDrawer}
        style={{
          padding: "6px 14px",
          borderRadius: "999px",
          border: "1px solid #7b5ea7",
          background: "#ffffff",
          color: "#7b5ea7",
          fontSize: "11px",
          fontWeight: "600",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all 0.15s ease",
          fontFamily: "'Montserrat', sans-serif",
          flexShrink: 0,
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
        {isMobile ? "+ Filtros" : "+ Todos los filtros"}
      </button>
    </div>
  );
}