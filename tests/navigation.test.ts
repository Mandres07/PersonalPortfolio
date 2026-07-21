// @vitest-environment jsdom
import {
  getNavigationThreshold,
  initializeSectionNavigation,
  setActiveNavItem,
} from "@/lib/navigation";

describe("navigation", () => {
  test("uses a lower threshold on mobile widths", () => {
    expect(getNavigationThreshold(768)).toBe(0.1);
    expect(getNavigationThreshold(769)).toBe(0.3);
  });

  test("activates the matching nav item and aria-current", () => {
    document.body.innerHTML = `
      <ul>
        <li class="nav-item" data-section="experience"><a href="#experience"></a></li>
        <li class="nav-item" data-section="skills"><a href="#skills"></a></li>
      </ul>
    `;

    const navItems = document.querySelectorAll(".nav-item");
    setActiveNavItem(navItems, "skills");

    expect(navItems[0].classList.contains("text-skin-nav")).toBe(false);
    expect(navItems[1].classList.contains("text-skin-nav")).toBe(true);
    expect(
      navItems[1].classList.contains("dark:bg-skin-button-accent/10"),
    ).toBe(true);
    expect(navItems[1].querySelector("a")?.getAttribute("aria-current")).toBe(
      "location",
    );
  });

  test("observes only linked sections and disconnects during cleanup", () => {
    document.body.innerHTML = `
      <section class="main-section" id="experience"></section>
      <section class="main-section" id="skills"></section>
      <section class="main-section" id="projects"></section>
      <ul>
        <li class="nav-item" data-section="experience"><a href="#experience"></a></li>
        <li class="nav-item" data-section="skills"><a href="#skills"></a></li>
      </ul>
    `;

    const observe = vi.fn();
    const disconnect = vi.fn();
    class MockIntersectionObserver {
      constructor(
        public callback: IntersectionObserverCallback,
        public options?: IntersectionObserverInit,
      ) {}

      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
    }

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    const cleanup = initializeSectionNavigation(document, window);

    expect(observe).toHaveBeenCalledTimes(2);
    cleanup();
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
