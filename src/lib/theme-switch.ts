export interface ThemeSwitchOptions {
  document: Document;
  window: Window;
}

export function getCurrentLanguage(pathname: string): "en" | "es" {
  return pathname.startsWith("/es") ? "es" : "en";
}

export function shouldRedirectLanguage(
  value: string,
  pathname: string,
): boolean {
  const isCurrentlySpanish = pathname.startsWith("/es");
  const isTargetSpanish = value === "es";

  return (
    (isTargetSpanish && !isCurrentlySpanish) ||
    (isCurrentlySpanish && !isTargetSpanish)
  );
}

export function getRedirectPath(value: string): string {
  return value === "en" ? "/" : "/es";
}

export function getInitialDarkMode(
  storedTheme: string | null,
  prefersDark: boolean,
): boolean {
  return storedTheme === "dark" || (storedTheme == null && prefersDark);
}

export function updateTheme(
  document: Document,
  isDark: boolean,
  themeSwitchButton?: HTMLElement | null,
): void {
  document.documentElement.classList.toggle("dark", isDark);
  themeSwitchButton?.setAttribute("aria-pressed", String(isDark));
  window.localStorage.setItem("theme", isDark ? "dark" : "light");
}

export function updateDataTheme(document: Document, value: string): void {
  document.body.setAttribute("data-theme", value);
  window.localStorage.setItem("data-theme", value);
}

export function redirectByLanguage(location: Location, value: string): void {
  location.href = getRedirectPath(value);
}

export function updateLanguage(value: string, window: Window): void {
  const currentPath = window.location.pathname;
  window.localStorage.setItem("language", value);

  if (shouldRedirectLanguage(value, currentPath)) {
    redirectByLanguage(window.location, value);
  }
}

export function initializeThemeSwitch({
  document,
  window,
}: ThemeSwitchOptions): void {
  let isDark = document.documentElement.classList.contains("dark");
  const themeSwitchButton = document.getElementById("themeSwitch");
  const themeSelect = document.getElementById(
    "themeSelect",
  ) as HTMLSelectElement | null;
  const languageSelect = document.getElementById(
    "languageSelect",
  ) as HTMLSelectElement | null;
  const currentLanguage = getCurrentLanguage(window.location.pathname);

  function applyTheme(): void {
    updateTheme(document, isDark, themeSwitchButton);
  }

  function toggleDark(event: MouseEvent): void {
    const supportsViewTransitions =
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!supportsViewTransitions) {
      isDark = !isDark;
      applyTheme();
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = (
      document as Document & {
        startViewTransition?: (
          callback: () => void | Promise<void>,
        ) => { ready: Promise<void> };
      }
    ).startViewTransition?.(() => {
      isDark = !isDark;
      applyTheme();
    });

    transition?.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 400,
          easing: "ease-out",
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        },
      );
    });
  }

  themeSwitchButton?.addEventListener("click", toggleDark as EventListener);

  themeSelect?.addEventListener("change", (event) => {
    const selectedTheme = (event.target as HTMLSelectElement).value;
    updateDataTheme(document, selectedTheme);
  });

  window.localStorage.setItem("language", currentLanguage);

  if (languageSelect) {
    languageSelect.value = currentLanguage;
    languageSelect.addEventListener("change", (event) => {
      const selectedLanguage = (event.target as HTMLSelectElement).value;
      updateLanguage(selectedLanguage, window);
    });
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = window.localStorage.getItem("theme");
  isDark = getInitialDarkMode(storedTheme, prefersDark);
  applyTheme();

  const storedDataTheme =
    window.localStorage.getItem("data-theme") ||
    document.body.getAttribute("data-theme") ||
    "green";
  updateDataTheme(document, storedDataTheme);

  if (themeSelect) {
    themeSelect.value = storedDataTheme;
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (!("theme" in window.localStorage)) {
        isDark = event.matches;
        applyTheme();
      }
    });
}
