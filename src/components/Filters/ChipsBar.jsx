import React, { useRef, useEffect } from "react";
import data from "../../data/portfolio.json";

const { temas } = data.dicts;

export default function ChipsBar({
  activeFilters,
  toggleFilter,
  clearFilters,
  filteredCount,
  isMobile,      // ← nueva
  onOpenDrawer,
}) {
  const scrollRef = useRef(null);

  // Scroll horizontal con rueda de ratón
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

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
    {/* Chips con scroll horizontal */}
    <div
      ref={scrollRef}
      style={{
        display: "flex",
        gap: "6px",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        flex: 1,
        paddingBottom: "2px",
      }}
    >
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>

      {temas.map((tema) => {
        const active = activeFilters.includes(tema);
        return (
          <span
            key={tema}
            onClick={() => toggleFilter(tema)}
            style={{
              padding: "6px 12px",
              borderRadius: "999px",
              border: active
                ? "1px solid #7b5ea7"
                : "1px solid #e5e5e5",
              background: active ? "#7b5ea7" : "#ffffff",
              color: active ? "#ffffff" : "#5c5c5c",
              fontSize: "11px",
              fontWeight: "500",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
              fontFamily: "'Montserrat', sans-serif",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = "#7b5ea7";
                e.currentTarget.style.color = "#7b5ea7";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = "#e5e5e5";
                e.currentTarget.style.color = "#5c5c5c";
              }
            }}
          >
            {tema}
          </span>
        );
      })}
    </div>

    {/* PAPELERA - solo si hay filtros activos */}
    {activeFilters.length > 0 && (
      <button
        onClick={clearFilters}
        title="Quitar todos los filtros"
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

    {/* Botón "Todos los filtros" */}
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