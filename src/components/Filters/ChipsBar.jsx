import React, { useRef, useEffect, useState } from "react";

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

  const [showConfirm, setShowConfirm] = useState(false);

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
  <>
    <button
      onClick={() => setShowConfirm(true)}
      title="Borrar todos los favoritos"
      style={{ ... }}
    >
      🗑
    </button>

    {showConfirm && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setShowConfirm(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "24px",
            maxWidth: "320px",
            textAlign: "center",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          <p style={{ margin: "0 0 16px", color: "#333", fontSize: "14px" }}>
            ¿Borrar todos los favoritos?
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid #e5e5e5",
                background: "#fff",
                color: "#666",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                clearFavorites();
                clearFilters();
                setShowConfirm(false);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: "#e74c3c",
                color: "#fff",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Borrar
            </button>
          </div>
        </div>
      </div>
    )}
  </>
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