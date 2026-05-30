import { useState, useMemo, useEffect, useRef } from "react";
import data from "../data/portfolio.json";

export default function usePortfolio(favoritesRef = { current: [] }) {
  const { items: rawItems, dicts } = data;
  const { temas, tags, usos, tintas } = dicts;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todas");
  const [filters, setFilters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 18;
  const restoredRef = useRef(false);

useEffect(() => {
  if (restoredRef.current) return;
  try {
    const saved = localStorage.getItem("marist-art-filters");
    if (saved) {
      const { query: q, category: c, filters: f } = JSON.parse(saved);
      if (q) setQuery(q);
      if (c && c !== "todas") setCategory(c);
      if (f && f.length) setFilters(f);
    }
  } catch {}
  restoredRef.current = true;
}, []);

// Guardar filtros al cambiar
useEffect(() => {
  localStorage.setItem("marist-art-filters", JSON.stringify({ query, category, filters }));
}, [query, category, filters]);

  // 🔧 NORMALIZACIÓN
  const items = useMemo(() => {
    return rawItems.map((item) => {
      const temasLabels = item.meta.temas.map((i) => temas[i]);
      const tagsLabels = item.meta.tags.map((i) => tags[i]);
      const usosLabels = item.meta.usos.map((i) => usos[i]);
      const tintasLabels = item.meta.tintas.map((i) => tintas[i]);
      const allFilters = [...temasLabels, ...tagsLabels, ...usosLabels, ...tintasLabels];
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
      if (!favoritesFilterActive && category !== "todas" && item.categoria !== category) return false;

      if (
        q &&
        !item.titulo.toLowerCase().includes(q) &&
        !item.allFiltersLower.some((f) => f.includes(q)) &&
        !item.search.includes(q)
      )
        return false;

      if (cleanFilters.length > 0) {
  // Agrupar filtros por categoría (Temas, Tags, Usos)
  const filterCategories = {
    temas: cleanFilters.filter((f) => temas.map(t => t.toLowerCase()).includes(f)),
    tags: cleanFilters.filter((f) => tags.map(t => t.toLowerCase()).includes(f)),
    usos: cleanFilters.filter((f) => usos.map(t => t.toLowerCase()).includes(f)),
  };

  // Cada categoría con filtros activos debe cumplirse (AND entre categorías)
  if (filterCategories.temas.length > 0) {
    const matchesTemas = filterCategories.temas.some((f) =>
      item.allFiltersLower.includes(f)
    );
    if (!matchesTemas) return false;
  }

  if (filterCategories.tags.length > 0) {
    const matchesTags = filterCategories.tags.some((f) =>
      item.allFiltersLower.includes(f)
    );
    if (!matchesTags) return false;
  }

  if (filterCategories.usos.length > 0) {
    const matchesUsos = filterCategories.usos.some((f) =>
      item.allFiltersLower.includes(f)
    );
    if (!matchesUsos) return false;
  }
}
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