export function getYearFromIsoDate(value: string): number {
  return Number(value.slice(0, 4));
}
