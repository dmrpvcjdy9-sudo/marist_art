import { useState, useEffect, useCallback } from "react";

export default function usePersistState(hasActiveSearch) {
  const [showGrid, setShowGrid] = useState(() => {
    try {
      const saved = localStorage.getItem("marist-art-state");
      if (saved) {
        const { showGrid: savedShowGrid } = JSON.parse(saved);
        return savedShowGrid || false;
      }
    } catch {}
    return false;
  });

  // Persistir showGrid
  useEffect(() => {
    localStorage.setItem("marist-art-state", JSON.stringify({ showGrid }));
  }, [showGrid]);

  const effectiveHasActiveSearch = hasActiveSearch || showGrid;

  const forceShowGrid = useCallback(() => setShowGrid(true), []);
  const hideGrid = useCallback(() => setShowGrid(false), []);

  return {
    showGrid,
    setShowGrid,
    effectiveHasActiveSearch,
    forceShowGrid,
    hideGrid,
  };
}