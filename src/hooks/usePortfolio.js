import { useState, useMemo, useEffect, useRef } from "react";
import data from "../data/portfolio.json";

export default function usePortfolio(favoritesRef = { current: [] }) {
  const { items: rawItems, dicts } = data;
  const { temas, tags, usos } = dicts;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todas");
  const [filters, setFilters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);

  const pageSize = 18;

  // 🔧 NORMALIZACIÓN
  const items = useMemo(() => {
    return rawItems.map((item) => {
      const temasLabels = item.meta.temas.map((i) => temas[i]);
      const tagsLabels = item.meta.tags.map((i) => tags[i]);
      const usosLabels = item.meta.usos.map((i) => usos[i]);

      const allFilters = [...temasLabels, ...tagsLabels, ...usosLabels];
      const allFiltersLower = allFilters.map((f) => f.toLowerCase());

      let categoria = item.categoria;
      if (categoria === "otros") {
        if (item.id.startsWith("ilu-")) categoria = "ilustracion";
        if (item.id.startsWith("dis-")) categoria = "diseno";
      }

      return {
        ...item,
        categoria,
        allFilters,
        allFiltersLower,
      };
    });
  }, [rawItems, temas, tags, usos]);

  // 🔍 FILTROS
  const normalizedFilters = useMemo(
    () => filters.map((f) => f.toLowerCase()),
    [filters]
  );

  const favoritesFilterActive = normalizedFilters.includes("__favoritos__");
  const cleanFilters = normalizedFilters.filter((f) => f !== "__favoritos__");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const result = items.filter((item) => {
      if (favoritesFilterActive && !favoritesRef.current.includes(item.id)) return false;

      if (
        q &&
        !item.titulo.toLowerCase().includes(q) &&
        !item.allFiltersLower.some((f) => f.includes(q))
      )
        return false;

      if (
        cleanFilters.length &&
        !cleanFilters.some((f) => item.allFiltersLower.includes(f))
      )
        return false;

     if (favoritesFilterActive && !favoritesRef.current.includes(item.id)) return false;

      return true;
    });

    return result;
  }, [items, query, category, normalizedFilters]);

  // 📄 PAGINACIÓN
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  // 🔁 Control de página unificado
const prevKeyRef = useRef("");

useEffect(() => {
  // Crear una "clave" que ignore favoritos
  const filtersKey = filters
    .filter(f => f !== "__favoritos__")
    .sort()
    .join(",");
  const currentKey = `${query}|${category}|${filtersKey}`;
  const prevKey = prevKeyRef.current;

  if (prevKey && currentKey !== prevKey) {
    // Cambiaron los filtros reales: reset a página 1
    setPage(1);
  } else if (!prevKey) {
    // Primera ejecución: no hacer nada
  } else {
    // Mismos filtros: ajustar página si es necesario
    const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (page > maxPage) setPage(maxPage);
  }

  prevKeyRef.current = currentKey;
}, [query, category, filters, filtered.length, page, pageSize]);

// Al iniciar, recuperar estado guardado
useEffect(() => {
  const saved = localStorage.getItem("marist-art-filters");
  if (saved) {
    try {
      const { query: q, category: c, filters: f } = JSON.parse(saved);
      if (q) setQuery(q);
      if (c) setCategory(c);
      if (f) setFilters(f);
    } catch {}
  }
}, []);

// Guardar cambios
useEffect(() => {
  localStorage.setItem("marist-art-filters", JSON.stringify({ query, category, filters }));
}, [query, category, filters]);

  // 🎯 SELECTED seguro
  useEffect(() => {
    if (!filtered.length) {
      setSelected(null);
      return;
    }

    const exists = filtered.some((i) => i.id === selected?.id);
    if (!exists) setSelected(filtered[0]);
  }, [filtered]);

  // ¿Hay búsqueda o filtros activos?
  const hasActiveSearch = query.trim() !== "" || filters.length > 0 || category !== "todas";

  return {
    query,
    setQuery,
    category,
    setCategory,
    filters,
    setFilters,
    selected,
    setSelected,
    page,
    setPage,
    items,
    filtered,
    paginated,
    pageSize,
    temas,
    tags,
    usos,
    hasActiveSearch,
  };
}