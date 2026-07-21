import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const locales = [
  { path: "/", language: "en", ogLocale: "en_US" },
  { path: "/es/", language: "es", ogLocale: "es_PA" },
] as const;

const colorThemes = [
  "red",
  "blue",
  "yellow",
  "purple",
  "green",
  "orange",
  "pink",
  "aqua",
  "sepia",
  "blackwhite",
] as const;

for (const locale of locales) {
  test(`${locale.language} page has valid semantics, metadata, and section links`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.goto(locale.path);

    await expect(page.locator("html")).toHaveAttribute("lang", locale.language);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(
        locale.path === "/" ? "mandres\\.dev/$" : "mandres\\.dev/es/$",
      ),
    );
    await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="es"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      locale.ogLocale,
    );

    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    expect(() => JSON.parse(jsonLd ?? "")).not.toThrow();

    const sectionLinks = page.locator('nav a[href^="#"]');
    for (let index = 0; index < (await sectionLinks.count()); index += 1) {
      const target = await sectionLinks.nth(index).getAttribute("href");
      await expect(page.locator(target!)).toHaveCount(1);
    }

    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter(
        ({ impact }) => impact === "serious" || impact === "critical",
      ),
    ).toEqual([]);
  });
}

test("keyboard navigation exposes the skip link and native disclosures", async ({
  page,
}) => {
  await page.goto("/");
  const skipLink = page.locator(".skip-link");
  await skipLink.focus();
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  const disclosure = page.locator("details").first();
  await expect(disclosure).not.toHaveAttribute("open", "");
  await disclosure.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(disclosure).toHaveAttribute("open", "");
});

test("command palette opens and restores focus", async ({ page }) => {
  await page.goto("/");
  const paletteButton = page
    .locator('button[aria-label="Open command palette"]:visible')
    .first();
  await expect(page.locator("#hotkeypad")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(paletteButton).toBeEnabled();
  await paletteButton.focus();
  await paletteButton.evaluate((button: HTMLButtonElement) => button.click());
  await expect(page.locator("#hotkeypad [data-container]")).toBeVisible();
  await expect(page.locator("#hotkeypad input")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(paletteButton).toBeFocused();
});

test("image gallery opens in Fancybox and restores focus", async ({ page }) => {
  await page.goto("/");
  const galleryTrigger = page.locator('[data-fancybox="gallery"]').first();
  const initialUrl = page.url();

  await galleryTrigger.focus();
  await galleryTrigger.click();

  await expect(page.locator(".fancybox__dialog")).toBeVisible();
  expect(new URL(page.url()).pathname).toBe(new URL(initialUrl).pathname);
  await page.keyboard.press("Escape");
  await expect(page.locator(".fancybox__dialog")).toHaveCount(0);
  await expect(galleryTrigger).toBeFocused();
});

test("language selector preserves the supported locale routes", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#languageSelect").selectOption("es");
  await expect(page).toHaveURL(/\/es\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("all light and dark color themes pass automated contrast checks", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  test.skip(
    Boolean(isMobile),
    "Theme contrast is viewport-independent and covered on desktop.",
  );
  await page.goto("/");

  for (const theme of colorThemes) {
    await page.locator("#themeSelect").selectOption(theme);
    for (const dark of [false, true]) {
      await page.evaluate((enabled) => {
        document.documentElement.classList.toggle("dark", enabled);
      }, dark);
      await page.waitForTimeout(350);
      const results = await new AxeBuilder({ page })
        .withRules(["color-contrast"])
        .analyze();
      expect(
        results.violations,
        `${theme} ${dark ? "dark" : "light"} contrast violations`,
      ).toEqual([]);
    }
  }
});
