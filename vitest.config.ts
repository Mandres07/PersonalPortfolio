/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    globals: true,
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/lib/**/*.ts",
        "src/components/Section.astro",
        "src/components/ProjectCard.astro",
        "src/components/KeyboardManager.astro",
        "src/components/ThemeSwitch.astro",
        "src/components/pages/Page.astro",
        "src/components/sections/About.astro",
        "src/components/sections/Education.astro",
        "src/components/sections/Experience.astro",
        "src/components/sections/Footer.astro",
        "src/components/sections/Hero.astro",
        "src/components/sections/Images.astro",
        "src/components/sections/Navigation.astro",
        "src/components/sections/Projects.astro",
        "src/components/sections/Skills.astro",
        "src/layouts/Layout.astro",
      ],
      exclude: [
        "src/env.d.ts",
        "src/content.config.ts",
        "src/content/**",
        "src/pages/**",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
