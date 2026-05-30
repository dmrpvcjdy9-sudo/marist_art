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
// Extensión de imagen por categoría.
// Cuando los thumbs pasen a .webp, cambia solo aquí (o añade columna en Excel).
const IMAGE_EXT = {
  full: "png",
  thumb: "png",       // → cambiar a "webp" cuando estén listos
};
// =======================
// UTILIDADES
// =======================
// Para IDs, vocabulario y campos internos (quita acentos, minúsculas)
const normalize = (str) =>
  String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
 
// Para títulos y descripciones: solo trim, sin alterar el texto
const clean = (str) => String(str || "").trim();
const parseArray = (str) =>
  str
    ? str.split(";").map((s) => normalize(s)).filter(Boolean)
    : [];
 
// Deriva la categoría: primero mira la columna del Excel,
// si no es válida usa el prefijo del ID como fallback.
const getCategoria = (row) => {
  const fromExcel = normalize(row.categoria);
  if (VALID_CATEGORIES.has(fromExcel)) return fromExcel;
 
  // Fallback: prefijo del ID en mayúsculas (ILU-0001 → "ILU")
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
// Solo items en estado "final" llegan al JSON de producción.
// Los borradores o items en revisión se ignoran silenciosamente.
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
  parseArray(row.tintas).forEach((t) => tintasSet.add(t));
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
  const color = normalize(row.color);       // "multicolor", "blanco_negro", "escala_grises"
  const subcategoria = normalize(row.subcategoria);
 
  // Campo de búsqueda: todo lo que tiene sentido buscar por texto libre.
  // usePortfolio.js puede usar item.search para cubrir autor, origen, etc.
  const search = [
    cleanId,
    clean(row.titulo),
    clean(row.descripcion),
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
    titulo: clean(row.titulo),           // sin normalizar: se muestra en UI
    descripcion: clean(row.descripcion), // ídem
    categoria,
    subcategoria,
    color,
    imagenes: {
      id: cleanId,
      ext: IMAGE_EXT,   // { full: "png", thumb: "png" }
    },
    meta: {
      temas: temasArr.map((t) => temasIndex[t]).filter((i) => i !== undefined),
      tags:  tagsArr.map((t) =>  tagsIndex[t]).filter((i) => i !== undefined),
      usos:  usosArr.map((t) =>  usosIndex[t]).filter((i) => i !== undefined),
      tintas: parseArray(row.color).map((t) => tintasIndex[t]).filter((i) => i !== undefined),
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
console.log(`   Temas: ${temasDict.length} · Tags: ${tagsDict.length} · Usos: ${usosDict.length}`);