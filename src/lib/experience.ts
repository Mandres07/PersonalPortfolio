export function getExperienceToggleLabels(lang: string): {
  showMore: string;
  showLess: string;
} {
  return lang === "en"
    ? { showMore: "Show more", showLess: "Show less" }
    : { showMore: "Ver más", showLess: "Ver menos" };
}

export function bindExperienceExpanders(root: ParentNode = document): void {
  const expandButtons = root.querySelectorAll<HTMLElement>(".expand-button");

  expandButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.getAttribute("data-lang") ?? "en";
      const labels = getExperienceToggleLabels(lang);
      const container = button.closest<HTMLElement>(".expand-container");
      const expandText = button.querySelector<HTMLElement>(".expand-text");

      if (!container || !expandText) {
        return;
      }

      const isExpanded = container.dataset.expanded !== "true";
      container.dataset.expanded = isExpanded ? "true" : "false";
      button.setAttribute("aria-expanded", String(isExpanded));
      expandText.textContent = isExpanded
        ? labels.showLess
        : labels.showMore;
    });
  });
}
