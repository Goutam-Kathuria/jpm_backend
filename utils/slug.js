const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";

const generateUniqueSlug = async (Model, value, currentId) => {
  const baseSlug = slugify(value);
  let slug = baseSlug;
  let counter = 1;

  while (
    await Model.exists({
      slug,
      _id: { $ne: currentId },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

module.exports = {
  slugify,
  generateUniqueSlug,
};
