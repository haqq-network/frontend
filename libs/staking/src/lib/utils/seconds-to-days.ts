export function secondsToDays(secondsFrom: string): number {
  const seconds = Number.parseInt(secondsFrom.slice(0, -1), 10);
  return seconds / 60 / 60 / 24;
}
