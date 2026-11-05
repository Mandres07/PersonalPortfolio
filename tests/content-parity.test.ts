import cvEn from "@/content/cv.json";
import cvEs from "@/content/cv.es.json";

type IdentifiedRecord = { id: string };

function ids(records: IdentifiedRecord[]): string[] {
  return records.map(({ id }) => id);
}

describe("localized CV content", () => {
  test.each(["work", "projects", "education", "certificates"] as const)(
    "keeps stable and unique %s IDs in locale parity",
    (section) => {
      const englishIds = ids(cvEn[section]);
      const spanishIds = ids(cvEs[section]);

      expect(new Set(englishIds).size).toBe(englishIds.length);
      expect(new Set(spanishIds).size).toBe(spanishIds.length);
      expect(spanishIds).toEqual(englishIds);
    },
  );

  test("uses structured summary paragraphs without embedded markup", () => {
    for (const summary of [cvEn.basics.summary, cvEs.basics.summary]) {
      expect(summary.length).toBeGreaterThan(0);
      expect(
        summary.every((paragraph) => !/<br\s*\/?\s*>/i.test(paragraph)),
      ).toBe(true);
    }
  });

  test("keeps the grocery app consistent across locales", () => {
    for (const cv of [cvEn, cvEs]) {
      expect(
        cv.projects.find(({ id }) => id === "lista-de-compras"),
      ).toMatchObject({
        name: "Lista de Compras",
        url: "https://lista-de-compras-beta-eight.vercel.app/inventory",
        image: {
          url: "/images/lista-de-compras-sign-in.webp",
          width: 1440,
          height: 720,
        },
      });
    }
  });
});
