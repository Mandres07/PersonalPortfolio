import type { CollectionEntry } from "astro:content";

export type Locale = "en" | "es";
export type CV = CollectionEntry<"cv">["data"];
export type Basics = CV["basics"];
export type Work = CV["work"][number];
export type Project = CV["projects"][number];
export type EducationEntry = CV["education"][number];
export type Certificate = CV["certificates"][number];
export type Skill = CV["skills"][number];
export type ImageList = CV["images"];
export type Profile = Basics["profiles"][number];
export type SocialIcon = Record<string, string>;

export type SectionId =
  "experience" | "work" | "education" | "images" | "skills";
