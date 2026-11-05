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
  test(`${locale.language} prioritizes projects with visible navigation and contact actions`, async ({
    page,
    isMobile,
  }) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.goto(locale.path);

    const navigation = page.getByRole("navigation");
    await expect(navigation).toBeInViewport();
    const links = navigation.locator("a");
    await expect(links.first()).toHaveAttribute("href", "#work");
    for (const link of await links.all()) {
      await expect(link).toHaveAccessibleName(/.+/);
      const target = await link.boundingBox();
      expect(target?.width).toBeGreaterThanOrEqual(44);
      expect(target?.height).toBeGreaterThanOrEqual(44);
    }
    if (isMobile) {
      const bounds = await navigation.boundingBox();
      expect(bounds!.y + bounds!.height).toBeCloseTo(
        page.viewportSize()!.height,
        0,
      );
      const palette = page.locator(
        "button[data-command-palette-trigger]:visible",
      );
      const paletteBounds = await palette.boundingBox();
      expect(paletteBounds!.y + paletteBounds!.height).toBeLessThan(bounds!.y);
    }
    const goToProjects = async () => {
      await navigation.locator('a[href="#work"]').click();
    };

    const contactLabel = locale.language === "en" ? "Email me" : "Escríbeme";
    const contactLinks = page.getByRole("link", {
      name: contactLabel,
      exact: true,
    });
    await expect(contactLinks).toHaveCount(2);
    for (const link of await contactLinks.all()) {
      await expect(link).toHaveAttribute(
        "href",
        "mailto:mandres0807@outlook.com",
      );
    }
    const heroEmail = page
      .locator("#social-icons")
      .getByRole("link", { name: contactLabel, exact: true });
    await expect(heroEmail).toHaveCount(1);
    await expect(heroEmail.locator("svg")).toHaveCount(1);
    await expect(page.locator('header a[href="#work"]')).toHaveCount(0);
    const aboutBounds = await page.locator("#about").boundingBox();
    const selectorBounds = await page.locator("#themeSelect").boundingBox();
    expect(selectorBounds!.y).toBeGreaterThanOrEqual(
      aboutBounds!.y + aboutBounds!.height,
    );
    if (!isMobile) {
      const hintBounds = await page.locator("#normal-footer").boundingBox();
      expect(aboutBounds!.y + aboutBounds!.height).toBeLessThan(hintBounds!.y);
    }
    await goToProjects();
    await expect(page).toHaveURL(/#work$/);
    const projects = page.locator("#work");
    await expect(projects.locator("article")).toHaveCount(9);
    await expect(projects.locator("article:visible")).toHaveCount(9);
    const heading = projects.getByRole("heading", { level: 2 });
    await expect(heading).toBeInViewport();
    const navBounds = await navigation.boundingBox();
    const headingBounds = await heading.boundingBox();
    if (isMobile) {
      expect(headingBounds!.y).toBeGreaterThanOrEqual(0);
      expect(headingBounds!.y + headingBounds!.height).toBeLessThan(
        navBounds!.y,
      );
    } else {
      expect(headingBounds!.y).toBeGreaterThanOrEqual(
        navBounds!.y + navBounds!.height,
      );
      const projectBounds = await projects.boundingBox();
      expect(navBounds!.x).toBeCloseTo(projectBounds!.x, 0);
      expect(navBounds!.width).toBeCloseTo(projectBounds!.width, 0);
    }
    await expect(page.locator("#project-lista-de-compras a")).toHaveAttribute(
      "href",
      "https://lista-de-compras-beta-eight.vercel.app/inventory",
    );

    const screenshot = projects.locator('[data-fancybox="projects"]').first();
    await expect
      .poll(() =>
        screenshot
          .locator("img")
          .evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0,
          ),
      )
      .toBe(true);
    await screenshot.click();
    await expect(page.locator(".fancybox__dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".fancybox__dialog")).toHaveCount(0);
    await expect(screenshot).toBeFocused();

    await expect(projects.locator("details")).toHaveCount(0);

    for (const width of [320, 768]) {
      await page.setViewportSize({ width, height: 1024 });
      await goToProjects();
      const currentNavBounds = await navigation.boundingBox();
      const currentHeadingBounds = await heading.boundingBox();
      if (width < 640) {
        expect(currentHeadingBounds!.y).toBeGreaterThanOrEqual(0);
        expect(
          currentHeadingBounds!.y + currentHeadingBounds!.height,
        ).toBeLessThan(currentNavBounds!.y);
      } else {
        expect(currentHeadingBounds!.y).toBeGreaterThanOrEqual(
          currentNavBounds!.y + currentNavBounds!.height,
        );
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      for (const selector of [
        "#themeSwitch",
        "#themeSelect",
        "#languageSelect",
      ]) {
        const bounds = await page.locator(selector).boundingBox();
        expect(bounds?.height).toBeGreaterThanOrEqual(44);
        expect(bounds?.width).toBeGreaterThanOrEqual(44);
      }
    }
  });

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

test("section links identify the selected section", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const link of await page.locator("nav a").all()) {
    await link.click();
    await expect(link).toHaveAttribute("aria-current", "location");
  }
});

test("project previews fill matching frames and respect motion preferences", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const previews = page.locator('#work [data-fancybox="projects"]');
  for (const preview of await previews.all()) {
    await preview.scrollIntoViewIfNeeded();
    const image = preview.locator("img");
    await expect
      .poll(() =>
        image.evaluate(
          (element: HTMLImageElement) =>
            element.complete && element.naturalWidth > 0,
        ),
      )
      .toBe(true);
    const frame = await preview.boundingBox();
    const bounds = await image.boundingBox();
    expect(frame!.width / frame!.height).toBeCloseTo(16 / 9, 2);
    expect(bounds!.width).toBeCloseTo(frame!.width, 0);
    expect(bounds!.height).toBeCloseTo(frame!.height, 0);
    await expect(image).toHaveCSS("object-fit", "cover");
  }
  if (!isMobile) {
    const first = previews.first();
    await first.hover();
    await expect(first.locator("img")).toHaveCSS("scale", "1.05");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(first.locator("img")).toHaveCSS("scale", "none");
  }
});

test("navigation translucency follows the selected theme", async ({ page }) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation");
  await expect(navigation).toHaveCSS("backdrop-filter", "blur(12px)");
  const initialColor = await navigation.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.locator("#themeSelect").selectOption("purple");
  await expect
    .poll(() =>
      navigation.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      ),
    )
    .not.toBe(initialColor);
  expect(
    await navigation.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    ),
  ).toMatch(/(?:\/|,)\s*0\.85\)/);
});

test("mobile section links remain available without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const navigation = page.getByRole("navigation");
    await expect(navigation.locator("a:visible")).toHaveCount(5);
    await navigation.locator('a[href="#images"]').click();
    await expect(page).toHaveURL(/#images$/);
  } finally {
    await context.close();
  }
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
