import { getTranslations, isLocale, locales } from "@/i18n";

describe("localization", () => {
  test("accepts only supported locales", () => {
    expect(locales).toEqual(["en", "es"]);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("es")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  test("provides localized accessible labels and action text", () => {
    const en = getTranslations("en");
    const es = getTranslations("es");

    expect(en.navigation.goTo(en.sections.projects)).toBe("Go to Projects");
    expect(es.navigation.goTo(es.sections.projects)).toBe("Ir a Proyectos");
    expect(en.actions.openPalette).not.toBe(es.actions.openPalette);
    expect(en.skipLink).not.toBe(es.skipLink);
  });
});
