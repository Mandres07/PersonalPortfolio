/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  // Astro supports passing Vitest config here, even though Astro 5's type
  // declarations do not yet expose the `test` field on this helper.
  // @ts-expect-error Vitest config is supported by getViteConfig at runtime.
  test: {
    globals: true,
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      all: true,
      include: [
        "src/lib/**/*.ts",
        "src/components/Section.astro",
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
        "src/cv.d.ts",
        "src/types.d.ts",
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
