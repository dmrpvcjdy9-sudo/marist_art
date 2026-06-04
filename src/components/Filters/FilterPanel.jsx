import React, { useEffect } from "react";
import ChipsBar from "./ChipsBar";
import FilterDrawer from "./FilterDrawer";
import useIsMobile from "../../hooks/useIsMobile";

export default function FilterPanel({
  activeFilters,
  setActiveFilters,
  filteredCount,
  lightboxOpen,
  favoritesCount,
  clearFavorites,
  drawerOpen,
  setDrawerOpen,
  t,
}) {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (lightboxOpen) setDrawerOpen(false);
  }, [lightboxOpen, setDrawerOpen]);

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <ChipsBar
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        clearFilters={clearFilters}
        clearFavorites={clearFavorites}
        isMobile={isMobile}
        favoritesCount={favoritesCount}
        filteredCount={filteredCount}
        onOpenDrawer={() => setDrawerOpen(true)}
        t={t}
      />

      <FilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        clearFilters={clearFilters}
        isMobile={isMobile}
        t={t}
      />
    </div>
  );
}