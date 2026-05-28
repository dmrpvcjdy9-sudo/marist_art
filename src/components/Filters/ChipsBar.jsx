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
        background: "var(--bg-surface)",
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
          border: isFavoritesActive ? "1px solid var(--favorite)" : "1px solid var(--border)",
          background: isFavoritesActive ? "var(--favorite-bg)" : "var(--bg-surface)",
          color: isFavoritesActive ? "var(--favorite-dark)" : "var(--text-secondary)",
          fontSize: "11px",
          fontWeight: "600",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all 0.15s ease",
          fontFamily: "var(--font-primary)",
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
      style={{
  border: "none",
  background: "transparent",
  color: "var(--text-muted)",
  fontSize: "15px",
  cursor: "pointer",
  padding: "4px 8px",
  borderRadius: "6px",
  flexShrink: 0,
  transition: "all 0.15s ease",
}}
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
            fontFamily: "var(--font-primary)",
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
                fontFamily: "var(--font-primary)",
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
                fontFamily: "var(--font-primary)",
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
    color: "var(--text-muted)",
    fontStyle: "italic",
    fontFamily: "var(--font-primary)",
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
    border: activeFilters.filter(f => f !== "__favoritos__").length > 0
      ? "1px solid #7b5ea7"
      : "1px solid #7b5ea7",
    background: activeFilters.filter(f => f !== "__favoritos__").length > 0
      ? "var(--accent)"
      : "var(--bg-surface)",
    color: activeFilters.filter(f => f !== "__favoritos__").length > 0
      ? "var(--bg-surface)"
      : "var(--accent)",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.15s ease",
    fontFamily: "var(--font-primary)",
    flexShrink: 0,
  }}
  onMouseEnter={(e) => {
    if (activeFilters.filter(f => f !== "__favoritos__").length === 0) {
      e.currentTarget.style.background = "var(--accent)";
      e.currentTarget.style.color = "var(--bg-surface)";
    }
  }}
  onMouseLeave={(e) => {
    if (activeFilters.filter(f => f !== "__favoritos__").length === 0) {
      e.currentTarget.style.background = "var(--bg-surface)";
      e.currentTarget.style.color = "var(--text-primary)";
    }
  }}
>
  {isMobile ? "+ Filtros" : "+ Todos los filtros"}
  {activeFilters.filter(f => f !== "__favoritos__").length > 0 && (
    <span style={{ marginLeft: "4px", fontSize: "10px" }}>
      ({activeFilters.filter(f => f !== "__favoritos__").length})
    </span>
  )}
</button>
    </div>
  );
}