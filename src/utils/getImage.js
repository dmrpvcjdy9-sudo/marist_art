export const getImage = (item, type) => {
  const ext = type === "thumb" ? "webp" : "png";
  const v = "?v=20260607"; // ← quitar esta línea cuando ya no haga falta
  return `/${item.categoria}/${type}/${item.id}${
    type === "thumb" ? "-thumb" : ""
  }.${ext}${v}`;
};