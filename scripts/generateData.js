const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../data/PortfolioArTeV1.xlsx");
const OUTPUT = path.join(__dirname, "../src/data/portfolio.json");

const CATEGORY_MAP = {
  ILU: "ilustracion",
  DIS: "diseno",
  CUA: "cuadro",
};

const normalize = (str) =>
  String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const parseArray = (str) =>
  str
    ? str.split(";").map((s) => normalize(s)).filter(Boolean)
    : [];

// =======================
// 1. LEER EXCEL
// =======================
const workbook = xlsx.readFile(FILE);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet);

// =======================
// 2. VOCABULARIO
// =======================
const temasSet = new Set();
const tagsSet = new Set();
const usosSet = new Set();

rows.forEach((row) => {
  parseArray(row.temas).forEach((t) => temasSet.add(t));
  parseArray(row.tags).forEach((t) => tagsSet.add(t));
  parseArray(row.usos).forEach((t) => usosSet.add(t));
});

// 🔥 ORDEN ESTABLE
const temasDict = Array.from(temasSet).sort();
const tagsDict = Array.from(tagsSet).sort();
const usosDict = Array.from(usosSet).sort();

const temasIndex = Object.fromEntries(temasDict.map((v, i) => [v, i]));
const tagsIndex = Object.fromEntries(tagsDict.map((v, i) => [v, i]));
const usosIndex = Object.fromEntries(usosDict.map((v, i) => [v, i]));

// =======================
// 3. ITEMS
// =======================
const items = rows.map((row) => {
  const cleanId = normalize(row.id);

  const prefix = cleanId.split("-")[0] || "";
  const categoria = CATEGORY_MAP[prefix] || "otros";

  const temasArr = parseArray(row.temas);
  const tagsArr = parseArray(row.tags);
  const usosArr = parseArray(row.usos);

  const search = [
    cleanId,
    row.titulo,
    row.descripcion,
    categoria,
    row.subcategoria,
    row.origen,
    row.basado_en,
    ...temasArr,
    ...tagsArr,
    ...usosArr,
    row.color,
    row.licencia,
    row.estado,
  ]
    .filter(Boolean)
    .map(normalize)
    .join(" ");

  return {
    id: cleanId,
    titulo: row.titulo,
    descripcion: row.descripcion,
    categoria,
    subcategoria: normalize(row.subcategoria),

    imagenes: {
      id: cleanId,
    },

    meta: {
      temas: temasArr.map((t) => temasIndex[t]).filter((i) => i !== undefined),
      tags: tagsArr.map((t) => tagsIndex[t]).filter((i) => i !== undefined),
      usos: usosArr.map((t) => usosIndex[t]).filter((i) => i !== undefined),
    },

    creditos: {
      origen: row.origen || "",
      basado_en: row.basado_en || "",
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
    tags: tagsDict,
    usos: usosDict,
  },
};

fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));

console.log("✅ JSON optimizado generado correctamente");