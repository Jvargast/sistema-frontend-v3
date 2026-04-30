export const normalizeSearchText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const getSearchableText = (item, fields = []) =>
  fields
    .map((field) => {
      if (typeof field === "function") return field(item);
      return String(field)
        .split(".")
        .reduce((acc, key) => acc?.[key], item);
    })
    .filter((value) => value !== null && value !== undefined)
    .join(" ");

export const matchesSearch = (item, search, fields = []) => {
  const needle = normalizeSearchText(search);
  if (!needle) return true;
  const haystack = fields.length ? getSearchableText(item, fields) : item;
  const normalizedHaystack = normalizeSearchText(haystack);
  return needle
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => normalizedHaystack.includes(term));
};

export const filterBySearch = (items = [], search, fields = []) =>
  (Array.isArray(items) ? items : []).filter((item) =>
    matchesSearch(item, search, fields)
  );
