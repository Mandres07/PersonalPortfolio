// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import astroIcon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://mandres.dev",
  output: "static",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          es: "es",
        },
      },
    }),
    astroIcon({
      include: {
        mdi: [
          "bootstrap",
          "email",
          "folder-outline",
          "git",
          "github",
          "language-javascript",
          "language-typescript",
          "microsoft-azure",
          "microsoft-visual-studio",
          "microsoft-visual-studio-code",
          "react",
          "tailwind",
          "world",
        ],
        ri: [
          "angularjs-fill",
          "arrow-down-s-line",
          "arrow-up-line",
          "bootstrap-fill",
          "command-fill",
          "css3-fill",
          "github-fill",
          "html5-fill",
          "linkedin-fill",
          "moon-fill",
          "nextjs-fill",
          "nodejs-fill",
          "nodejs-line",
          "sun-fill",
          "whatsapp-fill",
          "wordpress-fill",
        ],
        "simple-icons": [
          "amazonaws",
          "android",
          "astro",
          "azuredevops",
          "blazor",
          "claude",
          "csharp",
          "docker",
          "dotnet",
          "express",
          "firebase",
          "git",
          "githubcopilot",
          "googlegemini",
          "html5",
          "microsoftsqlserver",
          "mongodb",
          "mysql",
          "ollama",
          "openai",
          "rabbitmq",
          "sqlite",
          "vite",
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
