import { useState, useMemo, useEffect } from "react";
import data from "../data/portfolio.json";

export default function usePortfolio(favorites = []) {
  const { items: rawItems, dicts } = data;
  const { temas, tags, usos } = dicts;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todas");
  const [filters, setFilters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [randomMode, setRandomMode] = useState(true);

  const pageSize = 24;

  // 🔧 NORMALIZACIÓN (CLAVE para rendimiento)
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

// ⭐ Detectar si el filtro de favoritos está activo
const favoritesFilterActive = normalizedFilters.includes("__favoritos__");
// Quitar __favoritos__ de los filtros normales para que no interfiera
const cleanFilters = normalizedFilters.filter((f) => f !== "__favoritos__");

const filtered = useMemo(() => {
  const q = query.trim().toLowerCase();

  let result = items.filter((item) => {
    if (category !== "todas" && item.categoria !== category) return false;

    if (
      q &&
      !item.titulo.toLowerCase().includes(q) &&
      !item.allFiltersLower.some((f) => f.includes(q))
    )
      return false;

    if (
      cleanFilters.length &&
      !cleanFilters.some((f) =>
        item.allFiltersLower.includes(f)
      )
    )
      return false;

    // ⭐ Filtro favoritos
    if (favoritesFilterActive && !favorites.includes(item.id)) return false;

    return true;
  });

  // 🎲 MODO ALEATORIO...
  if (randomMode && category === "todas" && !q && !normalizedFilters.length) {
    result = [...result].sort(() => Math.random() - 0.5);
  }

  return result;
}, [items, query, category, normalizedFilters, randomMode, favorites]);

  // 📄 PAGINACIÓN
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  // 🔁 RESET PAGE cuando cambian filtros
  useEffect(() => {
    setPage(1);
  }, [query, category, filters]);

  // 🔁 AJUSTAR página si se queda fuera
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (page > maxPage) setPage(maxPage);
  }, [filtered, page]);

  // 🔁 Cuando se usan filtros, búsqueda o categoría, desactivar random
  useEffect(() => {
    if (category !== "todas" || query.trim() !== "" || filters.length > 0) {
      setRandomMode(false);
    }
  }, [category, query, filters]);

  // 🎯 SELECTED seguro
  useEffect(() => {
    if (!filtered.length) {
      setSelected(null);
      return;
    }

    const exists = filtered.some((i) => i.id === selected?.id);
    if (!exists) setSelected(filtered[0]);
  }, [filtered]);

  return {
    // estado
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
    randomMode,
    setRandomMode,

    // datos
    items,
    filtered,
    paginated,
    pageSize,

    // dicts (para Header/Filtros)
    temas,
    tags,
    usos,
  };
}