// @vitest-environment jsdom
import {
  getCurrentLanguage,
  getInitialDarkMode,
  getRedirectPath,
  initializeThemeSwitch,
  redirectByLanguage,
  shouldRedirectLanguage,
  updateDataTheme,
  updateLanguage,
  updateTheme,
} from "@/lib/theme-switch";

describe("theme-switch", () => {
  type MatchMediaMock = {
    matches: boolean;
    media: string;
    onchange: null;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
    addListener: ReturnType<typeof vi.fn>;
    removeListener: ReturnType<typeof vi.fn>;
    dispatchEvent: ReturnType<typeof vi.fn>;
  };

  const mediaMap = new Map<string, MatchMediaMock>();

  beforeEach(() => {
    mediaMap.clear();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        const mock = {
          matches: query.includes("prefers-color-scheme"),
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        };
        mediaMap.set(query, mock);
        return mock;
      }),
    });
  });

  test("detects the current language from the pathname", () => {
    expect(getCurrentLanguage("/")).toBe("en");
    expect(getCurrentLanguage("/es")).toBe("es");
    expect(getCurrentLanguage("/es/projects")).toBe("es");
  });

  test("decides when a language switch should redirect", () => {
    expect(shouldRedirectLanguage("es", "/")).toBe(true);
    expect(shouldRedirectLanguage("en", "/es")).toBe(true);
    expect(shouldRedirectLanguage("en", "/")).toBe(false);
    expect(shouldRedirectLanguage("es", "/es")).toBe(false);
  });

  test("returns the expected redirect path", () => {
    expect(getRedirectPath("en")).toBe("/");
    expect(getRedirectPath("es")).toBe("/es");
  });

  test("computes the initial dark mode from storage and system preference", () => {
    expect(getInitialDarkMode("dark", false)).toBe(true);
    expect(getInitialDarkMode(null, true)).toBe(true);
    expect(getInitialDarkMode("light", true)).toBe(false);
  });

  test("updates the data theme and persists it", () => {
    updateDataTheme(document, "sepia");

    expect(document.body.getAttribute("data-theme")).toBe("sepia");
    expect(localStorage.getItem("data-theme")).toBe("sepia");
  });

  test("updates the theme button state and persistence", () => {
    document.body.innerHTML = `<button id="themeSwitch" aria-pressed="false"></button>`;
    const button = document.getElementById("themeSwitch");

    updateTheme(document, true, button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(button?.getAttribute("aria-pressed")).toBe("true");
    expect(localStorage.getItem("theme")).toBe("dark");

    updateTheme(document, false, button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(button?.getAttribute("aria-pressed")).toBe("false");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  test("redirects by language and skips redirect when already on the same locale", () => {
    const location = { href: "/" } as Location;
    redirectByLanguage(location, "es");
    expect(location.href).toBe("/es");

    const setItem = vi.fn();
    const windowLike = {
      location: { pathname: "/es", href: "/es" },
      localStorage: { setItem },
    } as unknown as Window;

    updateLanguage("es", windowLike);

    expect(setItem).toHaveBeenCalledWith("language", "es");
    expect(windowLike.location.href).toBe("/es");
  });

  test("redirects when the selected language changes locale", () => {
    const setItem = vi.fn();
    const windowLike = {
      location: { pathname: "/", href: "/" },
      localStorage: { setItem },
    } as unknown as Window;

    updateLanguage("es", windowLike);

    expect(setItem).toHaveBeenCalledWith("language", "es");
    expect(windowLike.location.href).toBe("/es");
  });

  test("initializes the controls from the current page and persisted values", () => {
    document.body.innerHTML = `
      <button id="themeSwitch" aria-pressed="false"></button>
      <select id="themeSelect">
        <option value="green">green</option>
        <option value="sepia">sepia</option>
      </select>
      <select id="languageSelect">
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    `;
    document.body.setAttribute("data-theme", "green");
    localStorage.setItem("theme", "dark");
    localStorage.setItem("data-theme", "sepia");
    window.history.replaceState({}, "", "/es");

    initializeThemeSwitch({ document, window });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(
      document.getElementById("themeSwitch")?.getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      (document.getElementById("themeSelect") as HTMLSelectElement).value,
    ).toBe("sepia");
    expect(
      (document.getElementById("languageSelect") as HTMLSelectElement).value,
    ).toBe("es");
    expect(localStorage.getItem("language")).toBe("es");
    expect(
      mediaMap
        .get("(prefers-color-scheme: dark)")
        ?.addEventListener.mock.calls[0]?.[0],
    ).toBe("change");
  });

  test("toggles dark mode through the button without view transitions", () => {
    document.body.innerHTML = `
      <button id="themeSwitch" aria-pressed="false"></button>
      <select id="themeSelect"><option value="green">green</option></select>
      <select id="languageSelect"><option value="en">English</option></select>
    `;
    document.body.setAttribute("data-theme", "green");

    initializeThemeSwitch({ document, window });

    const button = document.getElementById("themeSwitch") as HTMLButtonElement;
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  test("uses the view transition path when supported", async () => {
    document.body.innerHTML = `
      <button id="themeSwitch" aria-pressed="false"></button>
      <select id="themeSelect"><option value="green">green</option></select>
      <select id="languageSelect"><option value="en">English</option></select>
    `;
    document.body.setAttribute("data-theme", "green");

    const animate = vi.fn();
    document.documentElement.animate = animate;

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        const mock = {
          matches: query.includes("prefers-color-scheme")
            ? false
            : false,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        };
        mediaMap.set(query, mock);
        return mock;
      }),
    });

    const startViewTransition = vi.fn((callback: () => void) => {
      callback();
      return { ready: Promise.resolve() };
    });
    (
      document as Document & {
        startViewTransition?: typeof startViewTransition;
      }
    ).startViewTransition = startViewTransition;

    initializeThemeSwitch({ document, window });

    const button = document.getElementById("themeSwitch") as HTMLButtonElement;
    button.dispatchEvent(
      new MouseEvent("click", { bubbles: true, clientX: 10, clientY: 20 }),
    );
    await Promise.resolve();

    expect(startViewTransition).toHaveBeenCalledTimes(1);
    expect(animate).toHaveBeenCalledTimes(1);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  test("updates the selected data theme and language from change events", () => {
    document.body.innerHTML = `
      <button id="themeSwitch" aria-pressed="false"></button>
      <select id="themeSelect">
        <option value="green">green</option>
        <option value="sepia">sepia</option>
      </select>
      <select id="languageSelect">
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    `;
    document.body.setAttribute("data-theme", "green");
    window.history.replaceState({}, "", "/es");

    initializeThemeSwitch({ document, window });

    const themeSelect = document.getElementById("themeSelect") as HTMLSelectElement;
    themeSelect.value = "sepia";
    themeSelect.dispatchEvent(new Event("change", { bubbles: true }));

    const languageSelect = document.getElementById(
      "languageSelect",
    ) as HTMLSelectElement;
    languageSelect.value = "es";
    languageSelect.dispatchEvent(new Event("change", { bubbles: true }));

    expect(document.body.getAttribute("data-theme")).toBe("sepia");
    expect(localStorage.getItem("data-theme")).toBe("sepia");
    expect(localStorage.getItem("language")).toBe("es");
  });
});
