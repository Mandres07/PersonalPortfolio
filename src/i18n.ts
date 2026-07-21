import type { Locale } from "@/types";

export const locales: readonly Locale[] = ["en", "es"];

const translations = {
  en: {
    sections: {
      about: "About",
      experience: "Experience",
      projects: "Projects",
      education: "Education",
      certificates: "Certificates",
      images: "Image Gallery",
      skills: "Skills",
    },
    navigation: {
      label: "Section navigation",
      goTo: (label: string) => `Go to ${label}`,
    },
    commandSections: {
      actions: "Actions",
      social: "Social",
    },
    theme: {
      color: "Color theme",
      language: "Language",
      switchToDark: "Switch to dark mode",
      switchToLight: "Switch to light mode",
      names: {
        red: "Red",
        blue: "Blue",
        yellow: "Yellow",
        purple: "Purple",
        green: "Green",
        orange: "Orange",
        pink: "Pink",
        aqua: "Aqua",
        sepia: "Sepia",
        blackwhite: "Mono",
      },
      languages: { en: "English", es: "Spanish" },
    },
    actions: {
      visit: (name: string) => `Visit ${name}`,
      visitProfile: (network: string) => `Visit profile on ${network}`,
      repository: (name: string) => `View ${name} repository on GitHub`,
      screenshot: (name: string) => `Open project screenshot for ${name}`,
      sendEmail: "Send email",
      sendMessage: "Send WhatsApp message",
      openPalette: "Open command palette",
      paletteHint: "Press Ctrl/Command + K to open the command palette.",
      paletteLead: "Press",
      paletteTrail: "to open the command palette.",
      search: "Search...",
      printResume: "Print Resume",
      details: "Responsibilities and achievements",
    },
    experience: {
      present: "Present",
      summary: "Summary",
      responsibilities: "Responsibilities",
      achievements: "Achievements",
      technologies: "Technologies used",
    },
    dates: { present: "Present" },
    footer: {
      remote: "Working remotely 🌍 (GMT-5) - Built with Astro + Tailwind CSS.",
      copyright:
        "Mario Andrés Morales. Made with 💻, ❤️, and a lot of semicolons.",
    },
    skipLink: "Skip to main content",
  },
  es: {
    sections: {
      about: "Sobre mí",
      experience: "Experiencia",
      projects: "Proyectos",
      education: "Educación",
      certificates: "Certificados",
      images: "Galería",
      skills: "Habilidades",
    },
    navigation: {
      label: "Navegación por secciones",
      goTo: (label: string) => `Ir a ${label}`,
    },
    commandSections: {
      actions: "Acciones",
      social: "Social",
    },
    theme: {
      color: "Tema de color",
      language: "Idioma",
      switchToDark: "Cambiar a modo oscuro",
      switchToLight: "Cambiar a modo claro",
      names: {
        red: "Rojo",
        blue: "Azul",
        yellow: "Amarillo",
        purple: "Púrpura",
        green: "Verde",
        orange: "Naranja",
        pink: "Rosado",
        aqua: "Aqua",
        sepia: "Sepia",
        blackwhite: "Mono",
      },
      languages: { en: "Inglés", es: "Español" },
    },
    actions: {
      visit: (name: string) => `Visitar ${name}`,
      visitProfile: (network: string) => `Visitar perfil en ${network}`,
      repository: (name: string) => `Ver el repositorio de ${name} en GitHub`,
      screenshot: (name: string) => `Abrir captura del proyecto ${name}`,
      sendEmail: "Enviar correo",
      sendMessage: "Enviar mensaje por WhatsApp",
      openPalette: "Abrir paleta de comandos",
      paletteHint:
        "Presiona Ctrl/Command + K para abrir la paleta de comandos.",
      paletteLead: "Presiona",
      paletteTrail: "para abrir la paleta de comandos.",
      search: "Buscar...",
      printResume: "Imprimir CV",
      details: "Responsabilidades y logros",
    },
    experience: {
      present: "Presente",
      summary: "Descripción",
      responsibilities: "Responsabilidades",
      achievements: "Logros",
      technologies: "Tecnologías usadas",
    },
    dates: { present: "Actual" },
    footer: {
      remote: "En remoto 🌍 (GMT-5) - Creado con Astro + Tailwind CSS.",
      copyright: "Mario Andrés Morales. Hecho con 💻, ❤️ y muchos {corchetes}.",
    },
    skipLink: "Saltar al contenido principal",
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
