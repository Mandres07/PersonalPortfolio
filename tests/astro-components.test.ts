import { experimental_AstroContainer as AstroContainer } from "astro/container";
import KeyboardManager from "@/components/KeyboardManager.astro";
import Page from "@/components/pages/Page.astro";
import About from "@/components/sections/About.astro";
import Education from "@/components/sections/Education.astro";
import Experience from "@/components/sections/Experience.astro";
import Footer from "@/components/sections/Footer.astro";
import Hero from "@/components/sections/Hero.astro";
import Images from "@/components/sections/Images.astro";
import Navigation from "@/components/sections/Navigation.astro";
import Projects from "@/components/sections/Projects.astro";
import Skills from "@/components/sections/Skills.astro";
import ThemeSwitch from "@/components/ThemeSwitch.astro";
import CVData from "@/content/cv.json";
import type { CV } from "@/types";

const CV = CVData as unknown as CV;

describe("Astro content components", () => {
  test("About renders structured localized paragraphs", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(About, {
      props: { locale: "es", summary: ["Hola", "Mundo"] },
    });

    expect(result).toContain("Sobre mí");
    expect(result).toContain("<p>Hola</p>");
    expect(result).toContain("<p>Mundo</p>");
  });

  test.each([
    ["en", "Working remotely"],
    ["es", "En remoto"],
  ] as const)("Footer renders %s copy", async (locale, expected) => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Footer, {
      props: { locale },
    });

    expect(result).toContain(expected);
    expect(result).toContain(String(new Date().getFullYear()));
  });

  test("Navigation renders only supplied sections", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Navigation, {
      props: { locale: "en", sections: ["experience", "skills"] },
    });

    expect(result).toContain('aria-label="Section navigation"');
    expect(result).toContain('href="#experience"');
    expect(result).toContain('href="#skills"');
    expect(result).not.toContain('href="#images"');
  });

  test("Navigation localizes Spanish labels", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Navigation, {
      props: { locale: "es", sections: ["experience", "work", "images"] },
    });

    expect(result).toContain("Navegación por secciones");
    expect(result).toContain("Experiencia");
    expect(result).toContain("Proyectos");
    expect(result).toContain("Galería");
  });

  test("ThemeSwitch renders localized labelled controls", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ThemeSwitch, {
      props: { locale: "es", defaultTheme: "green" },
    });

    expect(result).toContain('id="themeSwitch"');
    expect(result).toContain("Cambiar a modo oscuro");
    expect(result).toContain("Tema de color");
    expect(result).toContain("Idioma");
    expect(result).toContain('value="green" selected');
  });

  test("KeyboardManager renders localized palette metadata", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(KeyboardManager, {
      props: {
        locale: "en",
        profiles: [
          {
            network: "GitHub",
            icon: "mdi:github",
            username: "Mandres07",
            url: "https://github.com/Mandres07",
          },
        ],
      },
    });

    expect(result).toContain(">Ctrl</kbd>");
    expect(result).toContain(">Command</kbd>");
    expect(result).toContain("Open command palette");
    expect(result).toContain('id="hotkeypad"');
    expect(result).toContain('data-locale="en"');
    expect(result).toContain("GitHub");
  });

  test("Hero renders a semantic header with contact actions", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Hero, {
      props: {
        locale: "en",
        basics: {
          ...CV.basics,
          name: "Mario",
          label: "Developer",
          email: "mario@example.com",
        },
      },
    });

    expect(result).toContain("<header");
    expect(result).toContain("<h1");
    expect(result).toContain("<address");
    expect(result).toContain("mailto:mario@example.com");
    expect(result).toContain('loading="eager"');
    expect(result).toContain('fetchpriority="high"');
  });

  test("Education renders entries, dates, and certificates", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Education, {
      props: {
        locale: "en",
        education: [
          {
            id: "utp",
            institution: "Universidad Tecnologica de Panama",
            url: "https://utp.ac.pa",
            area: "Engineering",
            studyType: "Full-time student",
            startDate: "2010-01-01",
            endDate: "2015-06-01",
          },
        ],
        certificates: [
          {
            id: "astro-course",
            name: "Astro Course",
            date: "2024-02-10",
            issuer: "Udemy",
            url: "https://example.com/cert",
          },
        ],
      },
    });

    expect(result).toContain("2010 - 2015");
    expect(result).toContain("Certificates");
    expect(result).toContain('datetime="2024-02-10"');
  });

  test("Education supports current studies and no certificates", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Education, {
      props: {
        locale: "es",
        education: [
          {
            id: "school",
            institution: "Colegio",
            url: "",
            area: "Bachiller",
            studyType: "Tiempo completo",
            startDate: "2000-03-01",
            endDate: null,
          },
        ],
        certificates: [],
      },
    });

    expect(result).toContain("Actual");
    expect(result).not.toContain("Certificados");
  });

  test("Experience uses native disclosure for optional details", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Experience, {
      props: {
        locale: "en",
        work: [
          {
            id: "efiscal",
            name: "eFiscal Networks",
            position: "Lead Software Developer",
            location_type: "Remote",
            location: "PA",
            url: "https://www.efiscal.net",
            startDate: "2025-04-14",
            endDate: null,
            summary: "Lead full-stack developer",
            highlights: [],
            responsibilities: ["Own frontend delivery"],
            achievements: ["Introduced testing"],
            skills: { React: "mdi:react" },
          },
        ],
      },
    });

    expect(result).toContain("<details");
    expect(result).toContain("<summary");
    expect(result).toContain("Responsibilities and achievements");
    expect(result).toContain("Technologies used");
  });

  test("Experience omits disclosure when no details exist", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Experience, {
      props: {
        locale: "es",
        work: [
          {
            id: "example",
            name: "Intercloud",
            position: "Developer",
            location_type: "",
            location: "",
            url: null,
            startDate: "2020-01-01",
            endDate: "2021-02-01",
            summary: ["Uno", "Dos"],
            highlights: [],
            responsibilities: [],
            achievements: [],
            skills: {},
          },
        ],
      },
    });

    expect(result).toContain("Descripción");
    expect(result).not.toContain("<details");
  });

  test("Projects renders links and dimensionally accurate screenshots", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Projects, {
      props: {
        locale: "en",
        projects: [
          {
            id: "portal",
            name: "Portal",
            image: {
              url: "/images/sds-management-portal-profile.webp",
              position: "container",
              width: 2880,
              height: 1800,
            },
            isActive: true,
            description: "Management portal",
            highlights: ["Reporting"],
            url: "https://example.com",
            github: "https://github.com/example/repo",
          },
        ],
      },
    });

    expect(result).toContain("Visit Portal");
    expect(result).toContain("View Portal repository on GitHub");
    expect(result).toContain('width="2880"');
    expect(result).toContain('height="1800"');
  });

  test("Images and Skills render localized content", async () => {
    const container = await AstroContainer.create();
    const images = await container.renderToString(Images, {
      props: {
        locale: "es",
        images: {
          intro: "Galería personal",
          list: [
            {
              image: "/images/mario-judith-ghibli-style.webp",
              alt: "Mario y Judith",
              desc: "Cartagena",
            },
          ],
        },
      },
    });
    const skills = await container.renderToString(Skills, {
      props: {
        locale: "es",
        skills: [
          { name: "Testing", icon: "", level: "Intermedio", keywords: [] },
        ],
      },
    });

    expect(images).toContain('data-fancybox="gallery"');
    expect(images).toContain('aria-label="Cartagena"');
    expect(skills).toContain("Habilidades");
    expect(skills).toContain('title="Intermedio"');
  });

  test("Page renders the complete portfolio composition", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Page, {
      props: { CV, locale: "en" },
    });

    expect(result).toContain("Mario Andrés Morales");
    expect(result).toContain("Skip to main content");
    expect(result).toContain("Experience");
    expect(result).toContain("Projects");
    expect(result).toContain("Image Gallery");
    expect(result).toContain(">Command</kbd>");
  });
});
