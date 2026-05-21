import { getYearFromIsoDate } from "@/lib/date";

describe("date helpers", () => {
  test("extracts the year from an ISO date without timezone shifts", () => {
    expect(getYearFromIsoDate("2010-01-01")).toBe(2010);
    expect(getYearFromIsoDate("2025-04-14")).toBe(2025);
  });
});
