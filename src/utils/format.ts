export function formatMicrograms(ug: number): string {
  if (ug < 1000) return `${Math.round(ug)} µg`
  return `${(ug / 1000).toFixed(2)} mg`
}

export function titleCase(text: string): string {
  return text
    .split(' ')
    .map((word) => (word.length ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ')
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural
}
