import React, { useState } from "react";
import ChipsBar from "./ChipsBar";
import FilterDrawer from "./FilterDrawer";
import useIsMobile from "../../hooks/useIsMobile";

export default function FilterPanel({
  activeFilters,
  setActiveFilters,
  filteredCount,
  lightboxOpen,
  favoritesCount,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
  if (lightboxOpen) setDrawerOpen(false);
}, [lightboxOpen]);

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
        background: "#ffffff",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      {/* Contador */}
      <div
        style={{
          padding: "10px 20px 4px",
          fontSize: "13px",
          color: "#5c5c5c",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        {filteredCount} resultado{filteredCount === 1 ? "" : "s"}
      </div>

      {/* Chips de Temas */}
      <ChipsBar
  activeFilters={activeFilters}
  toggleFilter={toggleFilter}
  clearFilters={clearFilters}
  filteredCount={filteredCount}
  isMobile={isMobile}
  favoritesCount={favoritesCount}
  onOpenDrawer={() => setDrawerOpen(true)}
/>

      {/* Drawer con todos los filtros */}
      <FilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        clearFilters={clearFilters}
        isMobile={isMobile}
      />
    </div>
  );
}