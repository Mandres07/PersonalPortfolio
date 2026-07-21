const GALLERY_SELECTOR = "[data-fancybox]";

export interface GalleryImplementation {
  bind(root: HTMLElement): void;
  open(trigger: HTMLElement): void;
  unbind(root: HTMLElement): void;
}

type GalleryLoader = () => Promise<GalleryImplementation>;

const loadGallery: GalleryLoader = async () => {
  const { galleryImplementation } =
    await import("@/lib/gallery-implementation");
  return galleryImplementation;
};

function getGalleryTrigger(event: Event): HTMLElement | null {
  const target = event.target;
  return target instanceof Element
    ? target.closest<HTMLElement>(GALLERY_SELECTOR)
    : null;
}

export function initializeGallery(
  document: Document,
  loader: GalleryLoader = loadGallery,
): () => void {
  const root = document.body;
  const abortController = new AbortController();
  const { signal } = abortController;
  let implementation: GalleryImplementation | null = null;
  let loading: Promise<GalleryImplementation> | null = null;
  let destroyed = false;

  const ensureLoaded = (): Promise<GalleryImplementation> => {
    loading ??= loader().then((loadedImplementation) => {
      if (!destroyed) {
        implementation = loadedImplementation;
        implementation.bind(root);
      }
      return loadedImplementation;
    });
    return loading;
  };

  const preload = (event: Event) => {
    if (getGalleryTrigger(event)) {
      void ensureLoaded().catch(() => undefined);
    }
  };

  const openGallery = async (event: MouseEvent) => {
    const trigger = getGalleryTrigger(event);
    if (
      !trigger ||
      implementation ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    try {
      const loadedImplementation = await ensureLoaded();
      if (!destroyed) loadedImplementation.open(trigger);
    } catch {
      const href = trigger.getAttribute("href");
      if (href) document.defaultView?.location.assign(href);
    }
  };

  root.addEventListener("pointerover", preload, { signal });
  root.addEventListener("focusin", preload, { signal });
  root.addEventListener("click", openGallery, { capture: true, signal });

  return () => {
    destroyed = true;
    abortController.abort();
    implementation?.unbind(root);
  };
}
