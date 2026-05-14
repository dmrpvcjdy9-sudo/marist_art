import React from "react";

export default function Header({
  query,
  setQuery,
  category,
  setCategory,
  filters,
  setFilters,
  filteredCount,
  isMobile,
  searchOpen,
  setSearchOpen,
  openPanel,
  setOpenPanel,
  onLogoClick,
  onContactClick,
  setRandomMode,
}) {
  const navItems = [
    { key: "todas", label: "Todo" },
    { key: "ilustracion", label: "Ilustraciones" },
    { key: "diseno", label: "Diseños" },
  ];

  const handleNavClick = (catKey) => {
    setQuery("");
    setFilters([]);
    setCategory(catKey);
    if (catKey === "todas") setRandomMode(false);
    setOpenPanel(null);
  };

  return (
    <div
      style={{
        background: "#ffffff",
        padding: isMobile ? "10px 16px" : "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 100,
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      {/* IZQUIERDA: LOGO + LEMA (solo escritorio) */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <img
          src="/logo.png"
          alt="Marist-Art"
          style={{
            height: isMobile ? "36px" : "52px",
            cursor: "pointer",
            opacity: 0.9,
            transition: "opacity 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.9)}
          onClick={onLogoClick}
        />

        {!isMobile && (
          <span
            style={{
              fontSize: "12px",
              fontWeight: "300",
              fontStyle: "italic",
              color: "#7b5ea7",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              paddingTop: "2px",
            }}
          >
            Recursos gráficos con identidad marista
          </span>
        )}
      </div>

      {/* CENTRO: menú escritorio o hamburguesa móvil */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "12px" : "18px",
          flex: 1,
          justifyContent: isMobile ? "flex-end" : "center",
        }}
      >
        {!isMobile ? (
          <>
            {navItems.map((cat, i) => {
              const active = category === cat.key;
              return (
                <React.Fragment key={cat.key}>
                  <span
                    onClick={() => handleNavClick(cat.key)}
                    style={{
                      cursor: "pointer",
                      fontStyle: "italic",
                      color: active ? "#1a1a1a" : "#999999",
                      fontWeight: active ? "600" : "400",
                      fontSize: "13px",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {cat.label}
                  </span>
                  {i === navItems.length - 1 && (
                    <span
                      style={{
                        width: "3px",
                        height: "3px",
                        borderRadius: "50%",
                        background: "#ccc",
                        margin: "0 2px",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}

            <span
              onClick={onContactClick}
              style={{
                cursor: "pointer",
                fontStyle: "italic",
                color: "#999999",
                fontWeight: "400",
                fontSize: "13px",
                transition: "color 0.2s ease",
              }}
            >
              Contacto
            </span>
          </>
        ) : (
          <>
            {/* HAMBURGUESA */}
            <button
              onClick={() =>
                setOpenPanel(openPanel === "menu" ? null : "menu")
              }
              style={{
                border: "none",
                background: "transparent",
                fontSize: "22px",
                cursor: "pointer",
                color: "#1a1a1a",
                padding: "4px",
              }}
            >
              ☰
            </button>

            {/* LUPA MÓVIL */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "18px",
                cursor: "pointer",
                color: "#999999",
                padding: "4px",
              }}
            >
              🔍
            </button>

            {/* MENÚ DESPLEGABLE MÓVIL */}
            {openPanel === "menu" && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#ffffff",
                  borderBottom: "1px solid #e5e5e5",
                  padding: "16px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  zIndex: 99,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                }}
              >
                {navItems.map((cat) => {
                  const active = category === cat.key;
                  return (
                    <span
                      key={cat.key}
                      onClick={() => handleNavClick(cat.key)}
                      style={{
                        cursor: "pointer",
                        color: active ? "#1a1a1a" : "#5c5c5c",
                        fontWeight: active ? "600" : "400",
                        fontSize: "16px",
                        fontStyle: "italic",
                        padding: "8px 0",
                        borderBottom: "1px solid #f5f5f5",
                      }}
                    >
                      {cat.label}
                    </span>
                  );
                })}

                <span
                  onClick={() => {
                    onContactClick();
                    setOpenPanel(null);
                  }}
                  style={{
                    cursor: "pointer",
                    color: "#5c5c5c",
                    fontSize: "16px",
                    fontStyle: "italic",
                    padding: "8px 0",
                  }}
                >
                  Contacto
                </span>
              </div>
            )}

            {/* BUSCADOR DESPLEGABLE MÓVIL */}
            {searchOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#ffffff",
                  padding: "12px 16px",
                  borderBottom: "1px solid #e5e5e5",
                  zIndex: 99,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                }}
              >
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar ilustraciones..."
                  style={{
                    width: "100%",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "14px",
                    outline: "none",
                    fontFamily: "'Montserrat', sans-serif",
                    color: "#1a1a1a",
                  }}
                />
                {query && (
                  <span
                    onClick={() => {
                      setQuery("");
                      setSearchOpen(false);
                    }}
                    style={{
                      position: "absolute",
                      right: "24px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#999999",
                      fontSize: "14px",
                    }}
                  >
                    ✕
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* DERECHA: buscador (solo escritorio) */}
      {!isMobile && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #e5e5e5",
              borderRadius: "999px",
              padding: "6px 12px",
              background: "#ffffff",
              width: searchOpen ? "200px" : "36px",
              transition: "width 0.25s ease",
              overflow: "hidden",
            }}
          >
            <span
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                color: "#999999",
                cursor: "pointer",
                flexShrink: 0,
                fontSize: "14px",
              }}
            >
              🔍
            </span>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              placeholder=""
              aria-label="Buscar ilustraciones"
              style={{
                border: "none",
                outline: "none",
                fontSize: "13px",
                width: "100%",
                background: "transparent",
                color: "#1a1a1a",
                fontFamily: "'Montserrat', sans-serif",
              }}
            />

            {query && (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setQuery("");
                }}
                style={{
                  cursor: "pointer",
                  color: "#999999",
                  fontSize: "13px",
                  padding: "0 4px",
                  userSelect: "none",
                  flexShrink: 0,
                }}
              >
                ✕
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}