import { isLocale } from "@/i18n";
import type { Locale } from "@/types";

export const COLOR_THEMES = [
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

export type ColorTheme = (typeof COLOR_THEMES)[number];

export interface ThemeSwitchOptions {
  document: Document;
  window: Window;
}

export function isColorTheme(value: string | null): value is ColorTheme {
  return value !== null && COLOR_THEMES.includes(value as ColorTheme);
}

export function getCurrentLanguage(pathname: string): Locale {
  return /^\/es(?:\/|$)/.test(pathname) ? "es" : "en";
}

export function shouldRedirectLanguage(
  value: string,
  pathname: string,
): boolean {
  return isLocale(value) && value !== getCurrentLanguage(pathname);
}

export function getRedirectPath(value: string): string {
  return value === "es" ? "/es/" : "/";
}

export function getInitialDarkMode(
  storedTheme: string | null,
  prefersDark: boolean,
): boolean {
  if (storedTheme === "dark") return true;
  if (storedTheme === "light") return false;
  return prefersDark;
}

export function applyTheme(
  document: Document,
  isDark: boolean,
  themeSwitchButton?: HTMLElement | null,
): void {
  document.documentElement.classList.toggle("dark", isDark);
  themeSwitchButton?.setAttribute("aria-pressed", String(isDark));

  if (themeSwitchButton) {
    const label = isDark
      ? themeSwitchButton.dataset.switchLight
      : themeSwitchButton.dataset.switchDark;
    if (label) themeSwitchButton.setAttribute("aria-label", label);
  }
}

export function updateTheme(
  document: Document,
  window: Window,
  isDark: boolean,
  themeSwitchButton?: HTMLElement | null,
): void {
  applyTheme(document, isDark, themeSwitchButton);
  window.localStorage.setItem("theme", isDark ? "dark" : "light");
}

export function updateDataTheme(
  document: Document,
  window: Window,
  value: string,
): ColorTheme | null {
  if (!isColorTheme(value)) return null;

  document.body.setAttribute("data-theme", value);
  window.localStorage.setItem("data-theme", value);
  return value;
}

export function updateLanguage(value: string, window: Window): void {
  if (!isLocale(value)) return;

  window.localStorage.setItem("language", value);
  if (shouldRedirectLanguage(value, window.location.pathname)) {
    window.location.assign(getRedirectPath(value));
  }
}

export function initializeThemeSwitch({
  document,
  window,
}: ThemeSwitchOptions): () => void {
  const themeSwitchButton = document.getElementById("themeSwitch");
  const themeSelect = document.getElementById(
    "themeSelect",
  ) as HTMLSelectElement | null;
  const languageSelect = document.getElementById(
    "languageSelect",
  ) as HTMLSelectElement | null;
  const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const storedMode = window.localStorage.getItem("theme");
  let isDark = getInitialDarkMode(storedMode, colorSchemeQuery.matches);
  const abortController = new AbortController();
  const { signal } = abortController;

  applyTheme(document, isDark, themeSwitchButton);

  const storedDataTheme = window.localStorage.getItem("data-theme");
  const bodyDataTheme = document.body.getAttribute("data-theme");
  const initialDataTheme = isColorTheme(storedDataTheme)
    ? storedDataTheme
    : isColorTheme(bodyDataTheme)
      ? bodyDataTheme
      : "green";
  document.body.setAttribute("data-theme", initialDataTheme);
  if (themeSelect) themeSelect.value = initialDataTheme;

  const currentLanguage = getCurrentLanguage(window.location.pathname);
  window.localStorage.setItem("language", currentLanguage);
  if (languageSelect) languageSelect.value = currentLanguage;

  themeSwitchButton?.addEventListener(
    "click",
    (event) => {
      const applyNextTheme = () => {
        isDark = !isDark;
        updateTheme(document, window, isDark, themeSwitchButton);
      };

      if (!("startViewTransition" in document) || reducedMotionQuery.matches) {
        applyNextTheme();
        return;
      }

      const pointerEvent = event as MouseEvent;
      const x = pointerEvent.clientX;
      const y = pointerEvent.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );
      const transition = document.startViewTransition?.(applyNextTheme);

      transition?.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
          { clipPath: isDark ? [...clipPath].reverse() : clipPath },
          {
            duration: 400,
            easing: "ease-out",
            pseudoElement: isDark
              ? "::view-transition-old(root)"
              : "::view-transition-new(root)",
          },
        );
      });
    },
    { signal },
  );

  themeSelect?.addEventListener(
    "change",
    (event) => {
      updateDataTheme(
        document,
        window,
        (event.target as HTMLSelectElement).value,
      );
    },
    { signal },
  );

  languageSelect?.addEventListener(
    "change",
    (event) => {
      updateLanguage((event.target as HTMLSelectElement).value, window);
    },
    { signal },
  );

  colorSchemeQuery.addEventListener(
    "change",
    (event) => {
      if (window.localStorage.getItem("theme") === null) {
        isDark = event.matches;
        applyTheme(document, isDark, themeSwitchButton);
      }
    },
    { signal },
  );

  return () => abortController.abort();
}
