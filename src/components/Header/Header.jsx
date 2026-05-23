import React, { useRef, useEffect } from "react";

function useClickOutside(ref, callback) {
  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) callback();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, callback]);
}

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
  onVerTodo,
  onShowGrid,
}) {
  const navItems = [
    { key: "todas", label: "Todo" },
    { key: "ilustracion", label: "Ilustraciones" },
    { key: "diseno", label: "Diseños" },
  ];

  const searchRef = useRef(null);
useClickOutside(searchRef, () => setSearchOpen(false));

  const handleNavClick = (catKey) => {
  setQuery("");
  setFilters([]);
  setOpenPanel(null);
  
  if (catKey === "todas") {
    onVerTodo();
  } else {
    setCategory(catKey);
    if (onShowGrid) onShowGrid();
  }
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

      {/* CENTRO: menú escritorio */}
      {!isMobile && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            flex: 1,
            justifyContent: "center",
          }}
        >
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
        </div>
      )}

      {/* DERECHA: iconos móvil o buscador escritorio */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {isMobile ? (
          <>
            {/* LUPA */}
            <button
  onClick={() => {
    if (query) {
      // Si hay búsqueda activa, limpiar y cerrar
      setQuery("");
      setSearchOpen(false);
    } else {
      // Si no, abrir/cerrar buscador
      setSearchOpen(!searchOpen);
      setOpenPanel(null);
    }
  }}
  style={{
    border: "none",
    background: "transparent",
    fontSize: "18px",
    cursor: "pointer",
    color: searchOpen || query ? "#7b5ea7" : "#999999",
    padding: "4px",
  }}
  title={query ? "Limpiar búsqueda" : "Buscar"}
>
  {query ? "✕" : "🔍"}
</button>

            {/* HAMBURGUESA */}
            <button
              onClick={() =>
                setOpenPanel(openPanel === "menu" ? null : "menu")
              }
              style={{
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
                color: openPanel === "menu" ? "#1a1a1a" : "#999999",
                padding: "4px",
              }}
            >
              ☰
            </button>
          </>
        ) : (
          /* BUSCADOR ESCRITORIO */
          <div
  ref={searchRef}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid #e5e5e5",
    borderRadius: "999px",
    padding: "6px 10px",
    background: "#ffffff",
    width: searchOpen ? "180px" : "auto",
    maxWidth: "50vw",
    transition: "width 0.25s ease",
    overflow: "hidden",
  }}
>
  {/* X para limpiar (siempre visible si hay query) */}
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
        flexShrink: 0,
        order: 1,
      }}
    >
      ✕
    </span>
  )}

  {/* LUPA */}
  <span
    onClick={() => setSearchOpen(!searchOpen)}
    style={{
      color: "#999999",
      cursor: "pointer",
      flexShrink: 0,
      fontSize: "14px",
      order: 2,
    }}
  >
    🔍
  </span>

  {/* INPUT (solo si expandido) */}
  {searchOpen && (
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
        order: 3,
      }}
    />
  )}
</div>
        )}
      </div>

      {/* BUSCADOR MÓVIL CON OVERLAY */}
{isMobile && searchOpen && (
  <>
    {/* Overlay que cierra al pulsar fuera */}
    <div
      onClick={() => setSearchOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        zIndex: 98,
      }}
    />

    {/* Barra de búsqueda */}
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
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {/* LUPA pequeña a la izquierda */}
      <span style={{ color: "#999999", fontSize: "14px", flexShrink: 0 }}>🔍</span>

      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar ilustraciones..."
        style={{
          flex: 1,
          border: "1px solid #e5e5e5",
          borderRadius: "8px",
          padding: "10px 12px",
          fontSize: "14px",
          outline: "none",
          fontFamily: "'Montserrat', sans-serif",
          color: "#1a1a1a",
          minWidth: 0,
        }}
      />

      {/* X para limpiar y cerrar */}
      {query && (
        <span
          onClick={() => {
            setQuery("");
            setSearchOpen(false);
          }}
          style={{
            cursor: "pointer",
            color: "#999999",
            fontSize: "14px",
            flexShrink: 0,
          }}
        >
          ✕
        </span>
      )}
    </div>
  </>
)}

      {/* MENÚ DESPLEGABLE MÓVIL */}
      {isMobile && openPanel === "menu" && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#ffffff",
            padding: "12px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            zIndex: 99,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            borderBottom: "1px solid #e5e5e5",
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
                  fontSize: "14px",
                  fontStyle: "italic",
                  padding: "6px 0",
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
              fontSize: "14px",
              fontStyle: "italic",
              padding: "6px 0",
            }}
          >
            Contacto
          </span>
        </div>
      )}
    </div>
  );
}