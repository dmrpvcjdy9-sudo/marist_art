import React, { useEffect, useRef, useState } from "react";
import data from "../../data/portfolio.json";

const { temas, tags, usos } = data.dicts;

const GROUPS = [
  { label: "Temas", items: temas, color: "#1e3a5f" },
  { label: "Tags", items: tags, color: "#7b5ea7" },
  { label: "Usos", items: usos, color: "#2c3e50" },
];

export default function FilterDrawer({
  isOpen,
  onClose,
  activeFilters,
  toggleFilter,
  clearFilters,
  isMobile,
}) {
  const [openGroups, setOpenGroups] = useState(["Temas", "Tags", "Usos"]);
  const drawerRef = useRef(null);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Evitar scroll del body cuando está abierto en móvil
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  if (!isOpen && !isMobile) return null;

  const activeCount = activeFilters.length;

  const content = (
    <div
      ref={drawerRef}
      style={{
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#1a1a1a", display: "flex", alignItems: "center", gap: "8px" }}>
  Filtros
  {activeCount > 0 && (
    <span style={{ fontSize: "12px", color: "#7b5ea7", fontWeight: "500" }}>
      ({activeCount})
    </span>
  )}
  {activeCount > 0 && (
    <button
      onClick={clearFilters}
      title="Quitar todos los filtros"
      style={{
        border: "none",
        background: "transparent",
        color: "#999999",
        fontSize: "14px",
        cursor: "pointer",
        padding: "2px 4px",
        borderRadius: "4px",
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
</h3>

<button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: "20px", cursor: "pointer", color: "#999999", padding: "4px" }}>
  ✕
</button>
      </div>

      {/* GRUPOS */}
      <div
        style={{
          flex: 1,
          overflowY: "visible",
          padding: "16px 20px",
        }}
      >
        {GROUPS.map((group) => {
          const isGroupOpen = openGroups.includes(group.label);
          const activeInGroup = group.items.filter((item) =>
            activeFilters.includes(item)
          ).length;

          return (
            <div key={group.label} style={{ marginBottom: "20px" }}>
              {/* Título del grupo */}
              <button
                onClick={() =>
                  setOpenGroups((prev) =>
                    prev.includes(group.label)
                      ? prev.filter((g) => g !== group.label)
                      : [...prev, group.label]
                  )
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: "8px 0",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: group.color,
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                <span>{group.label}</span>
                {activeInGroup > 0 && (
                  <span
                    style={{
                      fontSize: "11px",
                      background: "#7b5ea7",
                      color: "#ffffff",
                      borderRadius: "999px",
                      padding: "1px 7px",
                      fontWeight: "500",
                    }}
                  >
                    {activeInGroup}
                  </span>
                )}
                <span
                  style={{
                    marginLeft: "auto",
                    transform: isGroupOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    fontSize: "12px",
                    color: "#999999",
                  }}
                >
                  ›
                </span>
              </button>

              {/* Items del grupo */}
              <div
                style={{
                  maxHeight: isGroupOpen ? "600px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    paddingTop: isGroupOpen ? "10px" : "0",
                    paddingLeft: "28px",
                  }}
                >
                  {group.items.map((item) => {
                    const active = activeFilters.includes(item);
                    return (
                      <span
                        key={item}
                        onClick={() => toggleFilter(item)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "999px",
                          border: active
                            ? "1px solid #7b5ea7"
                            : "1px solid #e5e5e5",
                          background: active ? "#7b5ea7" : "#ffffff",
                          color: active ? "#ffffff" : "#5c5c5c",
                          fontSize: "11px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
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
                        {item}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // MÓVIL: Bottom sheet
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 199,
              transition: "opacity 0.3s ease",
            }}
          />
        )}

        {/* Sheet */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            maxHeight: "75vh",
            borderRadius: "16px 16px 0 0",
            overflow: "hidden",
            overflowY: "auto",
            transform: isOpen ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.3s ease",
            boxShadow: "0 -8px 30px rgba(0,0,0,0.2)",
          }}
        >
          {/* Handle */}
          <div
            style={{
              width: "36px",
              height: "4px",
              background: "#ddd",
              borderRadius: "2px",
              margin: "10px auto",
            }}
          />
          {content}
        </div>
      </>
    );
  }

  // ESCRITORIO: Drawer lateral
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 199,
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "340px",
          maxWidth: "90vw",
          zIndex: 200,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          boxShadow: "-8px 0 30px rgba(0,0,0,0.15)",
        }}
      >
        {content}
      </div>
    </>
  );
}