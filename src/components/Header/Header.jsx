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
  onOpenDrawer,
  onShowFavorites,
  t,
  lang,
  toggleLang,
}) {
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
        background: "var(--bg-surface)",
        padding: isMobile ? "10px 16px" : "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 100,
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* IZQUIERDA: LOGO + LEMA (solo escritorio) */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "16px" }}>
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
              color: "var(--accent)",
              lineHeight: 1,
              whiteSpace: "nowrap",
              paddingBottom: "2px",
            }}
          >
            {t("header.lema")}
          </span>
        )}
      </div>

      {/* CENTRO: menú escritorio + Language Switcher */}
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
          <span
            onClick={() => handleNavClick("todas")}
            style={{
              cursor: "pointer",
              fontStyle: "italic",
              color: category === "todas" ? "var(--text-primary)" : "var(--text-muted)",
              fontWeight: category === "todas" ? "600" : "400",
              fontSize: "13px",
              transition: "color 0.2s ease",
            }}
          >
            {t("header.recursos")}
          </span>

          <span
            style={{
              width: "3px",
              height: "3px",
              borderRadius: "50%",
              background: "var(--text-muted)",
              margin: "0 2px",
            }}
          />

          <span
            onClick={onContactClick}
            style={{
              cursor: "pointer",
              fontStyle: "italic",
              color: "var(--text-muted)",
              fontWeight: "400",
              fontSize: "13px",
              transition: "color 0.2s ease",
            }}
          >
            {t("header.contacto")}
          </span>

          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "4px 10px",
              fontSize: "11px",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontFamily: "var(--font-primary)",
              marginLeft: "8px",
            }}
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
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
                  setQuery("");
                  setSearchOpen(false);
                } else {
                  setSearchOpen(!searchOpen);
                  setOpenPanel(null);
                }
              }}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "18px",
                cursor: "pointer",
                color: searchOpen || query ? "var(--accent)" : "var(--text-muted)",
                padding: "4px",
              }}
              title={query ? t("header.limpiar") : t("header.buscar")}
            >
              {query ? "✕" : "🔍"}
            </button>

            {/* Language Switcher móvil */}
            <button
              onClick={toggleLang}
              style={{
                border: "1px solid var(--border)",
                background: "transparent",
                borderRadius: "16px",
                padding: "4px 8px",
                fontSize: "10px",
                cursor: "pointer",
                color: "var(--text-muted)",
              }}
            >
              {lang === "es" ? "EN" : "ES"}
            </button>

            {/* HAMBURGUESA */}
            <button
              onClick={() => setOpenPanel(openPanel === "menu" ? null : "menu")}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
                color: openPanel === "menu" ? "var(--text-primary)" : "var(--text-muted)",
                padding: "4px",
              }}
            >
              ☰
            </button>
          </>
        ) : (
          <div
            ref={searchRef}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: query
                ? "1px solid var(--accent)"
                : "1px solid var(--border)",
              borderRadius: "999px",
              padding: "6px 10px",
              background: query
                ? "var(--accent)"
                : "var(--bg-surface)",
              width: searchOpen ? "180px" : "auto",
              maxWidth: "50vw",
              transition: "width 0.25s ease, background 0.2s ease, border-color 0.2s ease",
              overflow: "hidden",
            }}
          >
            {query && (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setQuery("");
                }}
                style={{
                  cursor: "pointer",
                  color: query ? "var(--bg-surface)" : "var(--text-muted)",
                  fontSize: "13px",
                  flexShrink: 0,
                  order: 1,
                }}
              >
                ✕
              </span>
            )}

            <span
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                color: query ? "var(--bg-surface)" : "var(--text-muted)",
                cursor: "pointer",
                flexShrink: 0,
                fontSize: "14px",
                order: 2,
              }}
            >
              🔍
            </span>

            {searchOpen && (
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                placeholder={t("header.buscar")}
                aria-label={t("header.buscar")}
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: "13px",
                  width: "100%",
                  background: "transparent",
                  color: query ? "var(--bg-surface)" : "var(--text-primary)",
                  fontFamily: "var(--font-primary)",
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
          <div
            onClick={() => setSearchOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
              zIndex: 98,
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "var(--bg-surface)",
              padding: "12px 16px",
              borderBottom: "1px solid var(--border)",
              zIndex: 99,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "var(--text-muted)", fontSize: "14px", flexShrink: 0 }}>🔍</span>

            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("header.buscar")}
              style={{
                flex: 1,
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "14px",
                outline: "none",
                fontFamily: "var(--font-primary)",
                color: "var(--text-primary)",
                minWidth: 0,
              }}
            />

            {query && (
              <span
                onClick={() => {
                  setQuery("");
                  setSearchOpen(false);
                }}
                style={{
                  cursor: "pointer",
                  color: "var(--text-muted)",
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

      {/* MENÚ HAMBURGUESA MÓVIL */}
      {isMobile && openPanel === "menu" && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "var(--bg-surface)",
            padding: "12px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            zIndex: 99,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span
            onClick={() => handleNavClick("todas")}
            style={{
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: "14px",
              fontStyle: "italic",
              padding: "6px 0",
            }}
          >
            {t("hamburguesa.recursos")}
          </span>

          <span
            onClick={() => {
              setOpenPanel(null);
              if (onShowGrid) onShowGrid();
              if (onOpenDrawer) onOpenDrawer();
            }}
            style={{
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: "14px",
              fontStyle: "italic",
              padding: "6px 0",
            }}
          >
            {t("hamburguesa.filtros")}
          </span>

          <span
            onClick={() => {
              setOpenPanel(null);
              if (onShowFavorites) onShowFavorites();
            }}
            style={{
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: "14px",
              fontStyle: "italic",
              padding: "6px 0",
            }}
          >
            ⭐ {t("hamburguesa.favoritos")}
          </span>

          <span
            onClick={() => {
              onContactClick();
              setOpenPanel(null);
            }}
            style={{
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: "14px",
              fontStyle: "italic",
              padding: "6px 0",
            }}
          >
            {t("hamburguesa.presentacion")}
          </span>

          <span
            onClick={() => {
              onContactClick();
              setOpenPanel(null);
            }}
            style={{
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: "14px",
              fontStyle: "italic",
              padding: "6px 0",
            }}
          >
            {t("hamburguesa.contacto")}
          </span>
        </div>
      )}
    </div>
  );
}