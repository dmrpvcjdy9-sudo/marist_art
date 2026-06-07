import React, { useEffect, useRef, useState } from "react";
import data from "../../data/portfolio.json";

const { temas, tags, usos, tintas } = data.dicts;

export default function FilterDrawer({
  isOpen,
  onClose,
  activeFilters,
  toggleFilter,
  clearFilters,
  isMobile,
  t,
}) {
  const GROUPS = [
    { label: t("filtros.temas"), items: temas, color: "#1e3a5f", key: "temas" },
    { label: t("filtros.tags"), items: tags, color: "var(--accent)", key: "tags" },
    { label: t("filtros.usos"), items: usos, color: "var(--bg-primary)", key: "usos" },
    { label: t("filtros.tintas"), items: tintas, color: "#6b5b3a", key: "tintas" },
  ];

  const [openGroups, setOpenGroups] = useState(["temas", "tags", "usos", "tintas"]);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

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
        background: "var(--bg-surface)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "var(--font-primary)",
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
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
          {t("filtros.label")}
          {activeCount > 0 && (
            <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: "500" }}>
              ({activeCount})
            </span>
          )}
        </h3>

        <button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: "20px", cursor: "pointer", color: "var(--text-secondary)", padding: "4px" }}>
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
          const isGroupOpen = openGroups.includes(group.key);
          const activeInGroup = group.items.filter((item) =>
            activeFilters.includes(item)
          ).length;

          return (
            <div key={group.key} style={{ marginBottom: "20px" }}>
              <button
                onClick={() =>
                  setOpenGroups((prev) =>
                    prev.includes(group.key)
                      ? prev.filter((g) => g !== group.key)
                      : [...prev, group.key]
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
                  fontFamily: "var(--font-primary)",
                }}
              >
                <span>{group.label}</span>
                {activeInGroup > 0 && (
                  <span
                    style={{
                      fontSize: "11px",
                      background: "var(--accent)",
                      color: "var(--text-light)",
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
                    color: "var(--text-muted)",
                  }}
                >
                  ›
                </span>
              </button>

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
  const label = t(`filtros.labels.${group.key}.${item}`) || item;
  return (
                      <span
                        key={item}
                        onClick={() => toggleFilter(item)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "999px",
                          border: active
                            ? "1px solid var(--accent)"
                            : "1px solid var(--border)",
                          background: active ? "var(--accent)" : "var(--bg-surface)",
                          color: active ? "var(--bg-surface)" : "var(--text-secondary)",
                          fontSize: "11px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.borderColor = "var(--accent)";
                            e.currentTarget.style.color = "var(--accent)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.color = "var(--text-secondary)";
                          }
                        }}
                      >
                        {label}
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