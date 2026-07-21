// @vitest-environment jsdom
import { initializeGallery, type GalleryImplementation } from "@/lib/gallery";

describe("gallery controller", () => {
  test("loads on first gallery click and opens without following the link", async () => {
    document.body.innerHTML = `
      <a href="/images/example.jpg" data-fancybox="gallery">
        <img src="/images/thumbnail.jpg" alt="Example" />
      </a>
    `;
    const implementation: GalleryImplementation = {
      bind: vi.fn(),
      open: vi.fn(),
      unbind: vi.fn(),
    };
    const loader = vi.fn().mockResolvedValue(implementation);
    const cleanup = initializeGallery(document, loader);
    const trigger = document.querySelector<HTMLElement>("[data-fancybox]");

    expect(loader).not.toHaveBeenCalled();

    trigger?.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        button: 0,
        cancelable: true,
      }),
    );

    await vi.waitFor(() => {
      expect(implementation.bind).toHaveBeenCalledWith(document.body);
      expect(implementation.open).toHaveBeenCalledWith(trigger);
    });

    cleanup();
    expect(implementation.unbind).toHaveBeenCalledWith(document.body);
  });

  test("preserves modified-click link behavior", () => {
    document.body.innerHTML =
      '<a href="#example" data-fancybox="gallery">Example</a>';
    const loader = vi.fn();
    const cleanup = initializeGallery(document, loader);
    const trigger = document.querySelector<HTMLElement>("[data-fancybox]");
    const event = new MouseEvent("click", {
      bubbles: true,
      button: 0,
      cancelable: true,
      metaKey: true,
    });

    trigger?.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(loader).not.toHaveBeenCalled();
    cleanup();
  });
});
