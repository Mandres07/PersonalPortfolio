import { Fancybox } from "@fancyapps/ui";

const GALLERY_SELECTOR = "[data-fancybox]";

export function initializeGallery(document: Document): () => void {
  const root = document.body;

  Fancybox.bind(root, GALLERY_SELECTOR, {
    hideScrollbar: false,
    placeFocusBack: true,
  });

  return () => Fancybox.unbind(root, GALLERY_SELECTOR);
}
