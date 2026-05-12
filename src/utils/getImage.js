export const getImage = (item, type) => {
  const ext = "png";
  return `/${item.categoria}/${type}/${item.id}${
    type === "thumb" ? "-thumb" : ""
  }.${ext}`;
};