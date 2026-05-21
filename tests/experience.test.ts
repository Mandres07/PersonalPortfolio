// @vitest-environment jsdom
import {
  bindExperienceExpanders,
  getExperienceToggleLabels,
} from "@/lib/experience";

describe("experience expanders", () => {
  test("returns localized toggle labels", () => {
    expect(getExperienceToggleLabels("en")).toEqual({
      showMore: "Show more",
      showLess: "Show less",
    });
    expect(getExperienceToggleLabels("es")).toEqual({
      showMore: "Ver más",
      showLess: "Ver menos",
    });
  });

  test("toggles expanded state and aria attributes", () => {
    document.body.innerHTML = `
      <div class="expand-container" data-expanded="false">
        <button class="expand-button" data-lang="en" aria-expanded="false">
          <span class="expand-text">Show more</span>
        </button>
      </div>
    `;

    bindExperienceExpanders(document);

    const button = document.querySelector(".expand-button") as HTMLButtonElement;
    const container = document.querySelector(".expand-container") as HTMLElement;
    const text = document.querySelector(".expand-text") as HTMLElement;

    button.click();
    expect(container.dataset.expanded).toBe("true");
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(text.textContent).toBe("Show less");

    button.click();
    expect(container.dataset.expanded).toBe("false");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(text.textContent).toBe("Show more");
  });
});
