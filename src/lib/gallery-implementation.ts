import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import type { GalleryImplementation } from "@/lib/gallery";

const GALLERY_SELECTOR = "[data-fancybox]";
const GALLERY_OPTIONS = {
  hideScrollbar: false,
  placeFocusBack: true,
};

export const galleryImplementation: GalleryImplementation = {
  bind(root) {
    Fancybox.bind(root, GALLERY_SELECTOR, GALLERY_OPTIONS);
  },
  open(trigger) {
    Fancybox.fromTriggerEl(trigger, GALLERY_OPTIONS);
  },
  unbind(root) {
    Fancybox.unbind(root, GALLERY_SELECTOR);
  },
};
