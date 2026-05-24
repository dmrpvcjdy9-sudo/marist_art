import { useState, useEffect, useCallback } from "react";

export default function usePersistState(hasActiveSearch) {
  const [showGrid, setShowGrid] = useState(false);

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