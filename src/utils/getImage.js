export const getImage = (item, type) => {
  const ext = type === "thumb" ? "webp" : "png";
  return `/${item.categoria}/${type}/${item.id}${
    type === "thumb" ? "-thumb" : ""
  }.${ext}`;
};