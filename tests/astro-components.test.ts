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
import CV from "@cv";

describe("Astro content components", () => {
  test("About renders localized title and summary html", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(About, {
      props: {
        lang: "es",
        summary: "Hola<br/>Mundo",
      },
    });

    expect(result).toContain("Sobre Mi");
    expect(result).toContain("Hola");
    expect(result).toContain("Mundo");
  });

  test("Footer renders localized copy", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Footer, {
      props: { lang: "en" },
    });

    expect(result).toContain("Working remotely");
    expect(result).toContain("Built with Astro + Tailwind CSS.");
  });

  test("Footer renders spanish copy", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Footer, {
      props: { lang: "es" },
    });

    expect(result).toContain("En Remoto");
    expect(result).toContain("Creado con Astro + Tailwind CSS.");
  });

  test("Navigation renders section links and labels", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Navigation, {
      props: { lang: "en" },
    });

    expect(result).toContain('aria-label="Section navigation"');
    expect(result).toContain('href="#experience"');
    expect(result).toContain("Experience");
    expect(result).toContain("Projects");
    expect(result).toContain("Skills");
  });

  test("Navigation renders spanish labels", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Navigation, {
      props: { lang: "es" },
    });

    expect(result).toContain('aria-label="Navegacion por secciones"');
    expect(result).toContain("Experiencia");
    expect(result).toContain("Proyectos");
    expect(result).toContain("Imágenes");
  });

  test("ThemeSwitch renders theme and language controls", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ThemeSwitch, {
      props: { lang: "en" },
    });

    expect(result).toContain('id="themeSwitch"');
    expect(result).toContain('id="themeSelect"');
    expect(result).toContain('id="languageSelect"');
    expect(result).toContain("Toggle dark mode");
    expect(result).toContain("Color theme");
  });

  test("ThemeSwitch renders spanish control labels", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ThemeSwitch, {
      props: { lang: "es" },
    });

    expect(result).toContain("Alternar modo oscuro");
    expect(result).toContain("Tema de color");
    expect(result).toContain("Idioma");
    expect(result).toContain("Español");
  });

  test("KeyboardManager renders hotkeypad metadata and localized labels", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(KeyboardManager, {
      props: {
        lang: "en",
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

    expect(result).toContain("Press");
    expect(result).toContain("Open command palette");
    expect(result).toContain('id="hotkeypad"');
    expect(result).toContain("Search...");
    expect(result).toContain("Visit GitHub");
  });

  test("Hero renders contact links and profile actions", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Hero, {
      props: {
        lang: "en",
        basics: {
          name: "Mario",
          label: "Developer",
          image: "/images/ghibli-avatar.webp",
          email: "mario@example.com",
          phone: "50766184828",
          url: "https://mandres.dev",
          summary: "Summary",
          theme: "green",
          location: {
            address: "Calle Lugano 305",
            city: "San Miguelito",
            countryCode: "PA",
            region: "Panama",
          },
          profiles: [
            {
              network: "GitHub",
              icon: "mdi:github",
              username: "Mandres07",
              url: "https://github.com/Mandres07",
            },
          ],
        },
      },
    });

    expect(result).toContain("Mario");
    expect(result).toContain("Developer");
    expect(result).toContain("mailto:mario@example.com");
    expect(result).toContain("https://wa.me/50766184828");
    expect(result).toContain("Visit profile on GitHub");
    expect(result).toContain("Open command palette");
  });

  test("Education renders entries and certificate section", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Education, {
      props: {
        className: "order-first",
        lang: "en",
        education: [
          {
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
            name: "Astro Course",
            date: "2024-02-10",
            issuer: "Udemy",
            url: "https://example.com/cert",
          },
        ],
      },
    });

    expect(result).toContain("Education");
    expect(result).toContain("Universidad Tecnologica de Panama");
    expect(result).toContain("2010 - 2015");
    expect(result).toContain("Certificates");
    expect(result).toContain("Astro Course");
  });

  test("Education renders spanish fallback text and optional branches", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Education, {
      props: {
        className: "",
        lang: "es",
        education: [
          {
            institution: "Colegio",
            url: "",
            area: "Bachiller",
            studyType: "Tiempo completo",
            startDate: "2000-03-01",
            endDate: null as unknown as string,
          },
        ],
        certificates: [],
      },
    });

    expect(result).toContain("Educación");
    expect(result).toContain("Colegio");
    expect(result).toContain("Actual");
    expect(result).not.toContain("Certificados");
  });

  test("Experience renders summary, toggle button, and technologies", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Experience, {
      props: {
        className: "",
        lang: "en",
        work: [
          {
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
            skills: {
              React: "mdi:react",
              TypeScript: "simple-icons:typescript",
            },
          },
        ],
      },
    });

    expect(result).toContain("Experience");
    expect(result).toContain("Lead Software Developer");
    expect(result).toContain("Summary");
    expect(result).toContain("Show more");
    expect(result).toContain('aria-expanded="false"');
    expect(result).toContain("Technologies used");
    expect(result).toContain("TypeScript");
  });

  test("Experience renders spanish and no-link branches", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Experience, {
      props: {
        className: "",
        lang: "es",
        work: [
          {
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

    expect(result).toContain("Experiencia");
    expect(result).toContain("Ver más");
    expect(result).toContain("Descripción");
    expect(result).toContain("2020");
    expect(result).toContain("2021");
  });

  test("Projects renders active, inactive, and GitHub branches", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Projects, {
      props: {
        className: "",
        lang: "en",
        projects: [
          {
            name: "Portal",
            image: {
              url: "/images/sds-management-portal-profile.webp",
              position: "container",
            },
            isActive: true,
            description: "Management portal",
            highlights: ["Reporting", "Authentication"],
            url: "https://example.com",
            github: "https://github.com/example/repo",
          },
          {
            name: "Internal Tool",
            image: {
              url: "/images/andyspets-welcome.webp",
              position: "cover",
            },
            isActive: false,
            description: "Internal only",
            highlights: [],
            url: "https://internal.example.com",
            github: null,
          },
        ],
      },
    });

    expect(result).toContain("Projects");
    expect(result).toContain("Visit Portal");
    expect(result).toContain("View Portal repository on GitHub");
    expect(result).toContain("Open project screenshot for Portal");
    expect(result).toContain("Internal Tool");
  });

  test("Images renders intro and gallery items", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Images, {
      props: {
        className: "",
        lang: "es",
        images: {
          intro: "Galeria personal",
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

    expect(result).toContain("Galería");
    expect(result).toContain("Galeria personal");
    expect(result).toContain('data-fancybox="gallery"');
    expect(result).toContain('aria-label="Cartagena"');
  });

  test("Skills renders badges with labels", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Skills, {
      props: {
        className: "",
        lang: "en",
        skills: [
          {
            name: "TypeScript",
            icon: "simple-icons:typescript",
            level: "Advanced",
            keywords: ["ts"],
          },
          {
            name: "Astro",
            icon: "simple-icons:astro",
            level: "Advanced",
            keywords: ["astro"],
          },
        ],
      },
    });

    expect(result).toContain("Skills");
    expect(result).toContain("TypeScript");
    expect(result).toContain("Astro");
    expect(result).toContain('title="Advanced"');
  });

  test("Skills renders spanish heading and branch without icon", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Skills, {
      props: {
        className: "",
        lang: "es",
        skills: [
          {
            name: "Testing",
            icon: "",
            level: "Intermedio",
            keywords: [],
          },
        ],
      },
    });

    expect(result).toContain("Habilidades");
    expect(result).toContain("Testing");
    expect(result).toContain('title="Intermedio"');
  });

  test("Page renders the full portfolio composition", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Page, {
      props: {
        CV,
        lang: "en",
      },
    });

    expect(result).toContain("Mario Andrés Morales");
    expect(result).toContain("Skip to main content");
    expect(result).toContain("Experience");
    expect(result).toContain("Projects");
    expect(result).toContain("Image Gallery");
    expect(result).toContain("Skills");
    expect(result).toContain("Press");
  });
});
