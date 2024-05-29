export function interpolate(
  current: number,
  minMax: [number, number],
  fromTo: [number, number] = [0, 1],
): number {
  const [min, max] = minMax;
  const [from, to] = fromTo;

  if (current <= min) {
    return from;
  }

  if (current >= max) {
    return to;
  }

  const ratio = (current - min) / (max - min);

  return from + ratio * (to - from);
}
