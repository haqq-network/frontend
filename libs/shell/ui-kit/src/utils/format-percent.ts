export function formatPercents(value: string): number {
  return Number.parseFloat((Number.parseFloat(value) * 100).toLocaleString());
}
