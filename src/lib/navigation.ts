export function getNavigationThreshold(innerWidth: number): number {
  return innerWidth <= 768 ? 0.1 : 0.3;
}

export function setActiveNavItem(
  navItems: Iterable<Element>,
  activeId: string | null,
): void {
  for (const item of navItems) {
    item.classList.remove("bg-skin-button-accent/20", "text-skin-hue");
    item.querySelector("a")?.removeAttribute("aria-current");
  }

  if (!activeId) {
    return;
  }

  const activeItem = document.querySelector(
    `.nav-item[data-section="${activeId}"]`,
  );
  const activeLink = activeItem?.querySelector("a");
  activeItem?.classList.add("bg-skin-button-accent/20", "text-skin-hue");
  activeLink?.setAttribute("aria-current", "location");
}

export function initializeSectionNavigation(
  document: Document,
  window: Window,
): void {
  const sections = document.querySelectorAll(".main-section");
  const navItems = document.querySelectorAll(".nav-item");
  const threshold = getNavigationThreshold(window.innerWidth);

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          setActiveNavItem(navItems, id);
        }
      });
    },
    { threshold },
  );

  sections.forEach((section) => observer.observe(section));
}
