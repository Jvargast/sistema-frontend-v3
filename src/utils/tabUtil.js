export const getTabKey = (currentPath) => {
  const cleanPath = currentPath.split("?")[0];
  if (cleanPath.startsWith("admin/")) {
    const adminPath = cleanPath.replace(/\/(ver|editar|crear)\/.*$/, "");
    return adminPath;
  }
  const mainPath = cleanPath.replace(/\/(ver|editar|crear)\/.*$/, "");
  if (!mainPath.includes("/")) {
    return mainPath;
  }
  return mainPath;
};
