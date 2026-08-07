export const slugify = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .concat(`-${Date.now().toString(36)}`); // suffix guarantees uniqueness
