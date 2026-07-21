export function getNavigationThreshold(innerWidth: number): number {
  return innerWidth <= 768 ? 0.1 : 0.3;
}

export function setActiveNavItem(
  navItems: Iterable<Element>,
  activeId: string | null,
): void {
  const items = Array.from(navItems);
  for (const item of items) {
    item.classList.remove(
      "bg-skin-button-accent/20",
      "dark:bg-skin-button-accent/10",
      "text-skin-nav",
    );
    item.querySelector("a")?.removeAttribute("aria-current");
  }

  if (!activeId) {
    return;
  }

  const activeItem = items.find(
    (item) => item.getAttribute("data-section") === activeId,
  );
  const activeLink = activeItem?.querySelector("a");
  activeItem?.classList.add(
    "bg-skin-button-accent/20",
    "dark:bg-skin-button-accent/10",
    "text-skin-nav",
  );
  activeLink?.setAttribute("aria-current", "location");
}

export function initializeSectionNavigation(
  document: Document,
  window: Window,
): () => void {
  const navItems = document.querySelectorAll(".nav-item");
  const navigableIds = new Set(
    Array.from(navItems, (item) => item.getAttribute("data-section")),
  );
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>(".main-section"),
  ).filter((section) => navigableIds.has(section.id));
  const threshold = getNavigationThreshold(window.innerWidth);
  const visibleSections = new Map<string, number>();

  if (sections.length === 0 || navItems.length === 0) return () => undefined;

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (!id) return;
        if (entry.isIntersecting)
          visibleSections.set(id, entry.intersectionRatio);
        else visibleSections.delete(id);
      });

      const activeId =
        [...visibleSections.entries()].sort(
          (left, right) => right[1] - left[1],
        )[0]?.[0] ?? null;
      setActiveNavItem(navItems, activeId);
    },
    { threshold: [0, threshold, 0.5, 1] },
  );

  sections.forEach((section) => observer.observe(section));
  return () => observer.disconnect();
}
