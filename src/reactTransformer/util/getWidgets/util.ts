export const getVueTypeName = (key, prefix) => {
  if (!key) return;
  if (/^antd-/.test(key)) {
    return key;
  }
  const name = key
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
  return prefix ? `${prefix}-${name}` : name;
};

export function revertName(name) {
  const words = name.split("-");
  words.shift();
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join("");
}
