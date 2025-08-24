export const getTabKey = (currentPath = "") => {
  const raw = currentPath.split("?")[0].replace(/^\/+/, "");
  const base = raw.replace(/\/(ver|editar|crear)(\/.*)?$/, "");
  const parts = base.split("/").filter(Boolean);

  if (parts[0] === "admin") {
    return parts.length >= 2 ? `admin/${parts[1]}` : "admin";
  }

  return parts[0] || "";
};
