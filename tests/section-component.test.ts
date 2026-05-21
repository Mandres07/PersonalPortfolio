import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Section from "@/components/Section.astro";

describe("Section component", () => {
  test("renders a titled section with its slot content", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Section, {
      props: {
        id: "skills",
        title: "Skills",
        className: "extra-class",
      },
      slots: {
        default: "<p>Rendered slot</p>",
      },
    });

    expect(result).toContain('id="skills"');
    expect(result).toContain("Skills");
    expect(result).toContain("Rendered slot");
    expect(result).toContain("extra-class");
  });
});
