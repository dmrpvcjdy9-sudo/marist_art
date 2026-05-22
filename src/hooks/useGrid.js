import { useState, useEffect } from "react";
import { getImage } from "../utils/getImage";

export default function useGrid(filtered, setPage, page, pageSize, effectiveHasActiveSearch) {
  const [gridTransition, setGridTransition] = useState(true);

  // Transición grid
  useEffect(() => {
    setGridTransition(false);
    setPage(1);
    const t = setTimeout(() => setGridTransition(true), 150);
    return () => clearTimeout(t);
  }, [filtered, setPage]);

  // Precarga de imágenes (página actual + siguiente)
  useEffect(() => {
    const currentStart = (page - 1) * pageSize;
    const currentEnd = currentStart + pageSize;
    const currentItems = filtered.slice(currentStart, currentEnd);

    currentItems.forEach((item) => {
      const img = new Image();
      img.src = getImage(item, "thumb");
    });

    const nextStart = page * pageSize;
    const nextEnd = nextStart + pageSize;
    const nextItems = filtered.slice(nextStart, nextEnd);

    nextItems.forEach((item) => {
      const img = new Image();
      img.src = getImage(item, "thumb");
    });
  }, [page, filtered, pageSize]);

  // Mini-scroll para forzar pintado
  useEffect(() => {
    if (effectiveHasActiveSearch) {
      const timer = setTimeout(() => {
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [effectiveHasActiveSearch]);

  return { gridTransition };
}