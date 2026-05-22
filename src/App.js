import React, { useMemo, useEffect, useRef, useState } from "react";
import Grid from "./components/Grid/Grid";
import Lightbox from "./components/Lightbox/Lightbox";
import Header from "./components/Header/Header";
import FilterPanel from "./components/Filters/FilterPanel";
import Filters from "./components/Filters/Filters";
import Pagination from "./components/Pagination";
import Infopanels from "./components/Infopanels/Infopanels";
import Footer from "./components/Footer/Footer";
import { getImage } from "./utils/getImage";
import { Helmet, HelmetProvider } from "react-helmet-async";
import usePortfolio from "./hooks/usePortfolio";
import useIsMobile from "./hooks/useIsMobile";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import useFavorites from "./hooks/useFavorites";
import data from "./data/portfolio.json";

/* =========================
   DATA PREPARATION
========================= */
const rawItems = data.items;
const { temas, tags, usos } = data.dicts;

const items = rawItems.map((item) => {
  const temasLabels = item.meta.temas.map((i) => temas[i]);
  const tagsLabels = item.meta.tags.map((i) => tags[i]);
  const usosLabels = item.meta.usos.map((i) => usos[i]);

  const allFilters = [...temasLabels, ...tagsLabels, ...usosLabels];
  const allFiltersLower = allFilters.map((f) => f.toLowerCase());

  let categoria = item.categoria;
  if (categoria === "otros") {
    if (item.id.startsWith("ilu-")) categoria = "ilustracion";
    else if (item.id.startsWith("dis-")) categoria = "diseno";
  }

  return {
    ...item,
    categoria,
    temasLabels,
    tagsLabels,
    usosLabels,
    allFilters,
    allFiltersLower,
  };
});

/* =========================
   COMPONENTE
========================= */
export default function Portfolio() {

  /* UI STATE */
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [gridTransition, setGridTransition] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const gridScrollRef = useRef(0);
  const isMobile = useIsMobile();
  const { favorites, toggleFavorite, isFavorite, clearFavorites } = useFavorites();
  const favoritesRef = useRef(favorites);
useEffect(() => {
  favoritesRef.current = favorites;
}, [favorites]);
  const {
  query, setQuery,
  category, setCategory,
  filters, setFilters,
  filtered, paginated,
  page, setPage,
  selected, setSelected,
  pageSize,
  hasActiveSearch,        // ← nuevo
} = usePortfolio(favoritesRef);

  /* DERIVED */
  const options = useMemo(() => {
    const set = new Set();
    items.forEach((item) => {
      item.allFilters.forEach((f) => set.add(f));
    });
    return Array.from(set).sort();
  }, []);

  const pageSelected = paginated.find((item) => item.id === selected?.id) || null;
  const isSingle = filtered.length <= 2;
  const effectiveHasActiveSearch = hasActiveSearch || showGrid;
  const forceShowGrid = () => setShowGrid(true);

  /* =========================
     EFFECTS
  ========================= */

   // Precarga imágenes
  useEffect(() => {
    if (!selected) return;
    const index = filtered.findIndex((i) => i.id === selected.id);
    const next = filtered[index + 1];
    if (next) new Image().src = getImage(next, "full");
    const prev = filtered[index - 1];
    if (prev) new Image().src = getImage(prev, "full");
  }, [selected, filtered]);

  // Transición grid
  useEffect(() => {
    setGridTransition(false);
    setPage(1);
    const t = setTimeout(() => setGridTransition(true), 150);
    return () => clearTimeout(t);
  }, [filtered, setPage]);

  // Scroll lock lightbox
  useEffect(() => {
  if (lightboxOpen) {
    gridScrollRef.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${gridScrollRef.current}px`;
    document.body.style.width = "100%";
  } else {
    const scrollY = document.body.style.top;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  }
  return () => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
  };
}, [lightboxOpen]);

  // URL hash
  useEffect(() => {
    if (selected) {
      window.history.replaceState(null, "", `#${selected.id}`);
    }
  }, [selected]);

  // Keyboard navigation para Lightbox
useEffect(() => {
  const handleKey = (e) => {
    if (!lightboxOpen) return;
    
    if (e.key === "Escape") {
      setLightboxOpen(false);
      setSelected(null);
      setTimeout(() => {
        window.scrollTo({ top: gridScrollRef.current });
      }, 50);
    }
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };
  
  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, [lightboxOpen, selected, filtered]);

// Persistir showGrid al recargar
useEffect(() => {
  const saved = localStorage.getItem("marist-art-state");
  if (saved) {
    try {
      const { showGrid: savedShowGrid } = JSON.parse(saved);
      if (savedShowGrid) setShowGrid(true);
    } catch {}
  }
}, []);

useEffect(() => {
  localStorage.setItem("marist-art-state", JSON.stringify({ showGrid }));
}, [showGrid]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const found = items.find((item) => item.id === hash);
      if (found) setSelected(found);
    }
  }, [setSelected]);

  useEffect(() => {
  // Precargar página actual
  const currentStart = (page - 1) * pageSize;
  const currentEnd = currentStart + pageSize;
  const currentItems = filtered.slice(currentStart, currentEnd);
  
  currentItems.forEach((item) => {
    const img = new Image();
    img.src = getImage(item, "thumb");
  });

  // Precargar página siguiente
  const nextStart = page * pageSize;
  const nextEnd = nextStart + pageSize;
  const nextItems = filtered.slice(nextStart, nextEnd);
  
  nextItems.forEach((item) => {
    const img = new Image();
    img.src = getImage(item, "thumb");
  });
}, [page, filtered, pageSize]);

useEffect(() => {
  if (effectiveHasActiveSearch) {
    const timer = setTimeout(() => {
      window.scrollBy(0, 1);
      window.scrollBy(0, -1);
    }, 300);
    return () => clearTimeout(timer);
  }
}, [effectiveHasActiveSearch]);

  /* =========================
     HANDLERS (mínimos)
  ========================= */

  const changeSelected = (item) => {
    setSelected(item);
    setLightboxOpen(true);
  };

  const goNext = () => {
  if (!selected) return;
  const index = filtered.findIndex((i) => i.id === selected.id);
  if (filtered[index + 1]) setSelected(filtered[index + 1]);
};

const goPrev = () => {
  if (!selected) return;
  const index = filtered.findIndex((i) => i.id === selected.id);
  if (filtered[index - 1]) setSelected(filtered[index - 1]);
};

const handleVerTodo = () => {
  setQuery("");
  setFilters([]);
  setCategory("");
  setTimeout(() => {
    setCategory("todas");
    setShowGrid(true);
  }, 0);
};

  const handleLogoClick = () => {
  setQuery("");
  setCategory("todas");
  setFilters([]);
  setSelected(null);
  setShowGrid(false);   // ← vuelve a Welcome
};

  const handleContactClick = () => {
  const el = document.getElementById("info-panels");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

  /* =========================
     RENDER
  ========================= */

  return (
    <HelmetProvider>
      <div
        style={{
      fontFamily: "'Montserrat', sans-serif",
      minHeight: "100vh",
      background: "#2c3e50",
  color: "#e0e0e0",
    }}
      >
        <Helmet>
  <title>{selected ? selected.titulo : "Marist-Art"}</title>
  <link rel="manifest" href="/manifest.json" />
  <meta
    name="description"
    content="Repositorio de ilustraciones maristas gratuitas"
  />
  <meta property="og:title" content={selected?.titulo || "Marist-Art"} />
  <meta property="og:image" content={selected?.imagenes?.thumb || "/logo.png"} />
  <meta name="theme-color" content="#4f677d" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</Helmet>

        <Header
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
          filters={filters}
          setFilters={setFilters}
          filteredCount={filtered.length}
          isMobile={isMobile}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          openPanel={openPanel}
          setOpenPanel={setOpenPanel}
          onLogoClick={handleLogoClick}
          onContactClick={handleContactClick}
          onShowGrid={() => setShowGrid(true)}
          onShowGrid={forceShowGrid}
          onVerTodo={handleVerTodo}
        />

        {effectiveHasActiveSearch && (
        <FilterPanel
  activeFilters={filters}
  setActiveFilters={setFilters}
  filteredCount={filtered.length}
  lightboxOpen={lightboxOpen}
  favoritesCount={favorites.length}
  clearFavorites={clearFavorites}
/>
        )}

{/* WELCOME SCREEN */}
        {!effectiveHasActiveSearch && (
          <WelcomeScreen
            isMobile={isMobile}
            onVerTodas={handleVerTodo}
            onVerTodas={() => {
  setCategory("todas");
  setQuery("");
  setFilters([]);
  setShowGrid(true);
}}
          />
        )}

        {/* GRID (solo si hay búsqueda o filtros activos) */}
        {effectiveHasActiveSearch && (
          <div
            style={{
              padding: "12px 20px",
              opacity: gridTransition ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
          >
            {filtered.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "16px",
                  fontStyle: "italic",
                  padding: "40px 0",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Sin resultados. Prueba a modificar filtros o búsqueda.
              </div>
            )}

            <Pagination
              page={page}
              setPage={setPage}
              filteredLength={filtered.length}
              pageSize={pageSize}
            />

            <Grid
              items={paginated}
              selectedId={pageSelected?.id}
              onSelect={changeSelected}
              hoveredId={hovered}
              setHovered={setHovered}
              isSingle={isSingle}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />

            <Pagination
              page={page}
              setPage={setPage}
              filteredLength={filtered.length}
              pageSize={pageSize}
            />
          </div>
        )}

        <Lightbox
  selected={selected}
  isOpen={lightboxOpen}
  onClose={() => {
    setLightboxOpen(false);
    setSelected(null);
    setTimeout(() => {
      window.scrollTo({ top: gridScrollRef.current });
    }, 50);
  }}
  onNext={goNext}
  onPrev={goPrev}
  isMobile={isMobile}
/>
      {/* INFOPANELS */}
        <Infopanels />

        {/* FOOTER */}
        <Footer
  onLogoClick={() => {
    setQuery("");
    setCategory("todas");
    setFilters([]);
    setSelected(null);
    setShowGrid(false);   // ← vuelve a Welcome
  }}
/>
      </div>
    </HelmetProvider>
  );
}