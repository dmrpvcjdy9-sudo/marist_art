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
  const isMobile = useIsMobile();

  /* UI STATE */
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [gridTransition, setGridTransition] = useState(true);

  const gridScrollRef = useRef(0);

  /* PORTFOLIO STATE */
  const {
  query, setQuery,
  category, setCategory,
  filters, setFilters,
  filtered, paginated,
  page, setPage,
  selected, setSelected,
  pageSize,
  randomMode,        // ← nuevo
  setRandomMode,     // ← nuevo
} = usePortfolio();

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

  useEffect(() => {
  // Pequeño scroll para activar el Intersection Observer
  window.scrollBy(0, 1);
}, []);

useEffect(() => {
  // Forzar que el navegador recalculé el layout
  const timer = setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 100);
  return () => clearTimeout(timer);
}, []);

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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
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

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const found = items.find((item) => item.id === hash);
      if (found) setSelected(found);
    }
  }, [setSelected]);

  useEffect(() => {
  const start = page * pageSize;
  const end = start + pageSize;
  const nextPageItems = filtered.slice(start, end);
  
  nextPageItems.forEach((item) => {
    const img = new Image();
    img.src = getImage(item, "thumb");
  });
}, [page, filtered, pageSize]);

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

  const handleLogoClick = () => {
  setQuery("");
  setCategory("todas");
  setFilters([]);
  setRandomMode(true);    // ← activa random
  setSelected(null);
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
          setRandomMode={setRandomMode}
        />

        <FilterPanel
  activeFilters={filters}
  setActiveFilters={setFilters}
  filteredCount={filtered.length}
/>

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
          />

          <Pagination
            page={page}
            setPage={setPage}
            filteredLength={filtered.length}
            pageSize={pageSize}
          />
        </div>

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
          }}
        />
      </div>
    </HelmetProvider>
  );
}