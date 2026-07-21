// @vitest-environment jsdom
import {
  COLOR_THEMES,
  applyTheme,
  getCurrentLanguage,
  getInitialDarkMode,
  getRedirectPath,
  initializeThemeSwitch,
  isColorTheme,
  shouldRedirectLanguage,
  updateDataTheme,
  updateLanguage,
  updateTheme,
} from "@/lib/theme-switch";

describe("theme-switch", () => {
  const mediaQueries = new Map<string, MediaQueryList>();

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    document.body.innerHTML = "";
    document.body.removeAttribute("data-theme");
    window.history.replaceState({}, "", "/");
    mediaQueries.clear();

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn((query: string) => {
        const mediaQuery = {
          matches: query === "(prefers-color-scheme: dark)",
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        } as unknown as MediaQueryList;
        mediaQueries.set(query, mediaQuery);
        return mediaQuery;
      }),
    });
  });

  test("validates the supported color themes", () => {
    expect(COLOR_THEMES).toHaveLength(10);
    expect(COLOR_THEMES.every(isColorTheme)).toBe(true);
    expect(isColorTheme("unknown")).toBe(false);
    expect(isColorTheme(null)).toBe(false);
  });

  test("detects locale boundaries and builds canonical locale routes", () => {
    expect(getCurrentLanguage("/es/")).toBe("es");
    expect(getCurrentLanguage("/es/projects")).toBe("es");
    expect(getCurrentLanguage("/escape")).toBe("en");
    expect(shouldRedirectLanguage("es", "/")).toBe(true);
    expect(shouldRedirectLanguage("en", "/es/")).toBe(true);
    expect(shouldRedirectLanguage("invalid", "/")).toBe(false);
    expect(getRedirectPath("en")).toBe("/");
    expect(getRedirectPath("es")).toBe("/es/");
  });

  test("uses a valid stored mode before the system preference", () => {
    expect(getInitialDarkMode("dark", false)).toBe(true);
    expect(getInitialDarkMode("light", true)).toBe(false);
    expect(getInitialDarkMode("invalid", true)).toBe(true);
    expect(getInitialDarkMode(null, false)).toBe(false);
  });

  test("applies dynamic labels and only persists explicit updates", () => {
    document.body.innerHTML = `
      <button id="themeSwitch" data-switch-dark="Use dark" data-switch-light="Use light"></button>
    `;
    const button = document.getElementById("themeSwitch");

    applyTheme(document, true, button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(button?.getAttribute("aria-pressed")).toBe("true");
    expect(button?.getAttribute("aria-label")).toBe("Use light");
    expect(localStorage.getItem("theme")).toBeNull();

    updateTheme(document, window, false, button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(button?.getAttribute("aria-label")).toBe("Use dark");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  test("accepts valid color themes and ignores invalid values", () => {
    expect(updateDataTheme(document, window, "sepia")).toBe("sepia");
    expect(document.body.getAttribute("data-theme")).toBe("sepia");
    expect(localStorage.getItem("data-theme")).toBe("sepia");

    expect(updateDataTheme(document, window, "unsafe")).toBeNull();
    expect(document.body.getAttribute("data-theme")).toBe("sepia");
  });

  test("persists language and redirects only when the locale changes", () => {
    const assign = vi.fn();
    const windowLike = {
      location: { pathname: "/", assign },
      localStorage: { setItem: vi.fn() },
    } as unknown as Window;

    updateLanguage("es", windowLike);
    expect(windowLike.localStorage.setItem).toHaveBeenCalledWith(
      "language",
      "es",
    );
    expect(assign).toHaveBeenCalledWith("/es/");

    assign.mockClear();
    (windowLike.location as Location).pathname = "/es/";
    updateLanguage("es", windowLike);
    expect(assign).not.toHaveBeenCalled();
  });

  test("initializes persisted controls and exposes cleanup", () => {
    document.body.innerHTML = `
      <button id="themeSwitch" data-switch-dark="Use dark" data-switch-light="Use light"></button>
      <select id="themeSelect"><option value="green">green</option><option value="sepia">sepia</option></select>
      <select id="languageSelect"><option value="en">English</option><option value="es">Spanish</option></select>
    `;
    document.body.dataset.theme = "green";
    localStorage.setItem("theme", "dark");
    localStorage.setItem("data-theme", "sepia");
    window.history.replaceState({}, "", "/es/");

    const cleanup = initializeThemeSwitch({ document, window });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(
      document.getElementById("themeSwitch")?.getAttribute("aria-label"),
    ).toBe("Use light");
    expect(
      (document.getElementById("themeSelect") as HTMLSelectElement).value,
    ).toBe("sepia");
    expect(
      (document.getElementById("languageSelect") as HTMLSelectElement).value,
    ).toBe("es");
    expect(cleanup).toBeTypeOf("function");
    cleanup();
  });

  test("follows system changes only without an explicit preference", () => {
    document.body.innerHTML = `
      <button id="themeSwitch" data-switch-dark="Use dark" data-switch-light="Use light"></button>
    `;
    initializeThemeSwitch({ document, window });
    const query = mediaQueries.get("(prefers-color-scheme: dark)");
    const callback = vi.mocked(query!.addEventListener).mock.calls[0][1] as (
      event: MediaQueryListEvent,
    ) => void;

    callback({ matches: false } as MediaQueryListEvent);
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    localStorage.setItem("theme", "dark");
    callback({ matches: true } as MediaQueryListEvent);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  test("skips view transitions when reduced motion is requested", () => {
    document.body.innerHTML = `
      <button id="themeSwitch" data-switch-dark="Use dark" data-switch-light="Use light"></button>
    `;
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn((query: string) => {
        const result = originalMatchMedia(query);
        Object.defineProperty(result, "matches", {
          value: query.includes("reduced-motion"),
        });
        return result;
      }),
    });
    const startViewTransition = vi.fn();
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: startViewTransition,
    });

    initializeThemeSwitch({ document, window });
    document.getElementById("themeSwitch")?.click();

    expect(startViewTransition).not.toHaveBeenCalled();
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
