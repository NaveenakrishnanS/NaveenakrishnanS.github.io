/**
 * Draft handling. Placeholder content in src/data uses bracketed values like "[Project One]".
 * Such entries are drafts: the dev server shows them (so you can see what still needs filling),
 * but production builds leave them out entirely, so placeholder text can never ship.
 */

/** True for a bracketed placeholder string such as "[Project title]". */
function isPlaceholder(value: string | undefined): boolean {
  return value === undefined || /^\[.*\]$/.test(value.trim())
}

/** Keeps entries whose key fields are real content. In development, keeps everything. */
export function publishable<T>(items: readonly T[], keyFields: (item: T) => (string | undefined)[]): T[] {
  if (import.meta.env.DEV) return [...items]
  return items.filter((item) => keyFields(item).every((field) => !isPlaceholder(field)))
}

/**
 * A section's publishable items, or none at all when fewer than `min` of them survive.
 * A lone tile under a 160px heading reads thinner than no section, so the section hides itself
 * instead. Development is unaffected, since publishable() keeps every item there.
 */
export function publishableSection<T>(
  items: readonly T[],
  keyFields: (item: T) => (string | undefined)[],
  min = 2,
): T[] {
  const kept = publishable(items, keyFields)
  return kept.length >= min ? kept : []
}
