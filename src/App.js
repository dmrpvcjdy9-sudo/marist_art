import React, { useMemo, useEffect, useRef, useState } from "react";
import "./styles.css";
import Grid from "./components/Grid/Grid";
import Lightbox from "./components/Lightbox/Lightbox";
import Header from "./components/Header/Header";
import FilterPanel from "./components/Filters/FilterPanel";
import Filters from "./components/Filters/Filters";
import Pagination from "./components/Pagination";
import LinksPanel from "./components/LinksPanel/LinksPanel";
import Infopanels from "./components/Infopanels/Infopanels";
import Footer from "./components/Footer/Footer";
import useLightbox from "./hooks/useLightbox";
import useSearch from "./hooks/useSearch";
import usePersistState from "./hooks/usePersistState";
import useGrid from "./hooks/useGrid";
import { Helmet, HelmetProvider } from "react-helmet-async";
import usePortfolio from "./hooks/usePortfolio";
import useIsMobile from "./hooks/useIsMobile";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import useFavorites from "./hooks/useFavorites";
import data from "./data/portfolio.json";
import useLanguage from "./hooks/useLanguage";
import { Analytics } from "@vercel/analytics/react";

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
  const [hovered, setHovered] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  const { lang, t, toggleLang } = useLanguage();
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

const {
  lightboxOpen,
  selected: lightboxSelected,
  changeSelected,
  closeLightbox,
  goNext,
  goPrev,
} = useLightbox(filtered, setSelected);

const {
  searchOpen,
  setSearchOpen,
  openPanel,
  setOpenPanel,
} = useSearch();

const {
  showGrid,
  setShowGrid,
  effectiveHasActiveSearch,
  forceShowGrid,
  hideGrid,
} = usePersistState(hasActiveSearch);

const { gridTransition } = useGrid(filtered, setPage, page, pageSize, effectiveHasActiveSearch);

const gridRef = useRef(null);

useEffect(() => {
  if (gridRef.current) {
    gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}, [page]);

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

  /* =========================
     HANDLERS (mínimos)
  ========================= */
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
  setOpenPanel(null);
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
      fontFamily: "var(--font-primary)",
      minHeight: "100vh",
      background: "var(--bg-primary)",
  color: "#e0e0e0",
    }}
      >
        <Helmet>
  <title>{lightboxSelected ? lightboxSelected.titulo : "Marist-Art"}</title>
  <link rel="manifest" href="/manifest.json" />
  <meta
    name="description"
    content="Repositorio de ilustraciones maristas gratuitas"
  />
  <meta property="og:title" content={lightboxSelected?.titulo || "Marist-Art"} />
  <meta name="theme-color" content="#2c3e50" />
  <meta property="og:image" content={lightboxSelected ? `https://marist-art.org/${lightboxSelected.categoria}/full/${lightboxSelected.id}.png` : "https://marist-art.org/logo.png"} />
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
          onShowGrid={forceShowGrid}
          onVerTodo={handleVerTodo}
          t={t}
          lang={lang}
          toggleLang={toggleLang}
          onOpenDrawer={() => setDrawerOpen(true)}
          onShowFavorites={() => {
          setFilters(["__favoritos__"]);
          setShowGrid(true);
     }}
       />
        {effectiveHasActiveSearch && (
        <FilterPanel
  activeFilters={filters}
  setActiveFilters={setFilters}
  filteredCount={filtered.length}
  lightboxOpen={lightboxOpen}
  favoritesCount={favorites.length}
  clearFavorites={clearFavorites}
  drawerOpen={drawerOpen}
  setDrawerOpen={setDrawerOpen}
  t={t}
/>
        )}

{/* WELCOME SCREEN */}
        {!effectiveHasActiveSearch && (
          <WelcomeScreen
            isMobile={isMobile}
            onVerTodas={handleVerTodo}
            t={t}
          />
        )}

        {/* GRID (solo si hay búsqueda o filtros activos) */}
        {effectiveHasActiveSearch && (
          <div
            ref={gridRef}
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
                  color: "var(--text-light-muted)",
                  fontSize: "16px",
                  fontStyle: "italic",
                  padding: "40px 0",
                  fontFamily: "var(--font-primary)",
                }}
              >
                {t("grid.noResults")}
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
              isMobile={isMobile}
              lang={lang}
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
  selected={lightboxSelected}
  isOpen={lightboxOpen}
  onClose={closeLightbox}
  onNext={goNext}
  onPrev={goPrev}
  isMobile={isMobile}
  lang={lang}
  t={t}
/>
      {/* INFOPANELS */}
        <Infopanels t={t}/>
      {/* LINKS */}
        <LinksPanel />
        {/* FOOTER */}
        <Footer
  onLogoClick={() => {
    setQuery("");
    setCategory("todas");
    setFilters([]);
    setSelected(null);
    setShowGrid(false);   // ← vuelve a Welcome
  }}
  t={t}
/>
      </div>
    </HelmetProvider>
  );
}