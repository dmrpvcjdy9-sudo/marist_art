const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../data/PortfolioArTeV1.xlsx");
const OUTPUT = path.join(__dirname, "../src/data/portfolio.json");

// Categorías válidas y su fallback desde el prefijo del ID
const CATEGORY_MAP = {
  ILU: "ilustracion",
  DIS: "diseno",
  CUA: "cuadro",
};

const VALID_CATEGORIES = new Set(Object.values(CATEGORY_MAP));

// Extensión de imagen por categoría
const IMAGE_EXT = {
  full: "png",
  thumb: "webp",
};

// =======================
// UTILIDADES
// =======================
const normalize = (str) =>
  String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const clean = (str) => String(str || "").trim();

const parseArray = (str) =>
  str
    ? str.split(";").map((s) => normalize(s)).filter(Boolean)
    : [];

const getCategoria = (row) => {
  const fromExcel = normalize(row.categoria);
  if (VALID_CATEGORIES.has(fromExcel)) return fromExcel;

  const prefix = String(row.id || "").trim().split("-")[0].toUpperCase();
  const fromPrefix = CATEGORY_MAP[prefix];
  if (fromPrefix) {
    console.warn(`⚠️  ID ${row.id}: categoria "${row.categoria}" no reconocida, usando prefijo → "${fromPrefix}"`);
    return fromPrefix;
  }
  console.warn(`⚠️  ID ${row.id}: no se pudo determinar categoría, usando "otros"`);
  return "otros";
};

// =======================
// 1. LEER EXCEL
// =======================
const workbook = xlsx.readFile(FILE);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const allRows = xlsx.utils.sheet_to_json(sheet);

// Solo items en estado "final"
const rows = allRows.filter((row) => normalize(row.estado) === "final");
const skipped = allRows.length - rows.length;
if (skipped > 0) {
  console.log(`ℹ️  ${skipped} item(s) omitidos por estado !== "final"`);
}

// =======================
// 2. VOCABULARIO
// =======================
const temasSet = new Set();
const tagsSet = new Set();
const usosSet = new Set();
const tintasSet = new Set();

rows.forEach((row) => {
  parseArray(row.temas).forEach((t) => temasSet.add(t));
  parseArray(row.tags).forEach((t) => tagsSet.add(t));
  parseArray(row.usos).forEach((t) => usosSet.add(t));
  if (row.color) {
    tintasSet.add(normalize(row.color));
  }
});

// Orden estable: alfabético
const temasDict = Array.from(temasSet).sort();
const tagsDict = Array.from(tagsSet).sort();
const usosDict = Array.from(usosSet).sort();
const tintasDict = Array.from(tintasSet).sort();

const temasIndex = Object.fromEntries(temasDict.map((v, i) => [v, i]));
const tagsIndex = Object.fromEntries(tagsDict.map((v, i) => [v, i]));
const usosIndex = Object.fromEntries(usosDict.map((v, i) => [v, i]));
const tintasIndex = Object.fromEntries(tintasDict.map((v, i) => [v, i]));

// =======================
// 3. ITEMS
// =======================
const items = rows.map((row) => {
  const cleanId = normalize(row.id);
  const categoria = getCategoria(row);
  const temasArr = parseArray(row.temas);
  const tagsArr = parseArray(row.tags);
  const usosArr = parseArray(row.usos);
  const color = normalize(row.color);
  const subcategoria = normalize(row.subcategoria);

  // NUEVO: Leer títulos y descripciones en ambos idiomas
  const titulo_es = clean(row.titulo);
  const titulo_en = clean(row.titulo_en) || titulo_es; // fallback al español
  const descripcion_es = clean(row.descripcion);
  const descripcion_en = clean(row.descripcion_en) || descripcion_es; // fallback

  // Campo de búsqueda unificado (español + inglés + metadatos)
  const search = [
    cleanId,
    titulo_es,
    titulo_en,
    descripcion_es,
    descripcion_en,
    categoria,
    subcategoria,
    normalize(row.origen),
    normalize(row.basado_en),
    color,
    ...temasArr,
    ...tagsArr,
    ...usosArr,
  ]
    .filter(Boolean)
    .map(normalize)
    .join(" ");

  return {
    id: cleanId,
    // NUEVO: títulos y descripciones bilingües
    titulo: titulo_es,           // mantiene compatibilidad con código existente
    titulo_en: titulo_en,
    descripcion: descripcion_es,
    descripcion_en: descripcion_en,
    categoria,
    subcategoria,
    color,
    imagenes: {
      id: cleanId,
      ext: IMAGE_EXT,
    },
    meta: {
      temas: temasArr.map((t) => temasIndex[t]).filter((i) => i !== undefined),
      tags:  tagsArr.map((t) =>  tagsIndex[t]).filter((i) => i !== undefined),
      usos:  usosArr.map((t) =>  usosIndex[t]).filter((i) => i !== undefined),
      tintas: row.color
        ? [tintasIndex[normalize(row.color)]].filter((i) => i !== undefined)
        : [],
    },
    creditos: {
      origen:    clean(row.origen),
      basado_en: clean(row.basado_en),
    },
    search,
    destacado:
      row.destacado === true ||
      row.destacado === "TRUE" ||
      row.destacado === "true",
  };
});

// =======================
// 4. OUTPUT
// =======================
const output = {
  generatedAt: new Date().toISOString(),
  items,
  dicts: {
    temas: temasDict,
    tags:  tagsDict,
    usos:  usosDict,
    tintas: tintasDict,
  },
};

fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
console.log(`✅ portfolio.json generado: ${items.length} items`);
console.log(`   Temas: ${temasDict.length} · Tags: ${tagsDict.length} · Usos: ${usosDict.length} · Tintas: ${tintasDict.length}`);