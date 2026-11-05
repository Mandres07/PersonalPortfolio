import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const localeId = z.string().min(1);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const iconName = z.string();

const cv = defineCollection({
  loader: glob({ pattern: "cv*.json", base: "./src/content" }),
  schema: z.object({
    basics: z.object({
      name: z.string().min(1),
      label: z.string().min(1),
      image: z.string().min(1),
      email: z.email(),
      phone: z.string(),
      url: z.url(),
      summary: z.array(z.string().min(1)).min(1),
      theme: z.string().min(1),
      location: z.object({
        address: z.string(),
        city: z.string(),
        countryCode: z.string(),
        region: z.string(),
      }),
      profiles: z.array(
        z.object({
          network: z.string().min(1),
          icon: iconName,
          username: z.string(),
          url: z.url(),
        }),
      ),
    }),
    images: z.object({
      intro: z.string(),
      list: z.array(
        z.object({
          image: z.string().min(1),
          alt: z.string().min(1),
          desc: z.string().min(1),
        }),
      ),
    }),
    education: z.array(
      z.object({
        id: localeId,
        institution: z.string().min(1),
        url: z.union([z.url(), z.literal("")]),
        area: z.string(),
        studyType: z.string(),
        startDate: isoDate,
        endDate: isoDate.nullable(),
      }),
    ),
    certificates: z.array(
      z.object({
        id: localeId,
        name: z.string().min(1),
        date: isoDate,
        url: z.union([z.url(), z.literal("")]),
        issuer: z.string(),
      }),
    ),
    work: z.array(
      z.object({
        id: localeId,
        name: z.string().min(1),
        position: z.string().min(1),
        location_type: z.string(),
        location: z.string(),
        url: z.url().nullable(),
        startDate: isoDate,
        endDate: isoDate.nullable(),
        summary: z.union([z.string(), z.array(z.string())]),
        highlights: z.array(z.string()),
        responsibilities: z.array(z.string()),
        achievements: z.array(z.string()),
        skills: z.record(z.string(), z.string()),
      }),
    ),
    skills: z.array(
      z.object({
        name: z.string().min(1),
        icon: iconName,
        level: z.string(),
        keywords: z.array(z.string()),
      }),
    ),
    languages: z.array(z.object({ language: z.string(), fluency: z.string() })),
    interests: z.array(
      z.object({ name: z.string(), keywords: z.array(z.string()) }),
    ),
    references: z.array(z.object({ name: z.string(), reference: z.string() })),
    projects: z.array(
      z.object({
        id: localeId,
        name: z.string().min(1),
        image: z.object({
          url: z.string().min(1),
          alt: z.string().min(1).optional(),
          position: z.enum(["container", "cover"]),
          width: z.number().int().positive(),
          height: z.number().int().positive(),
        }),
        isActive: z.boolean(),
        description: z.string(),
        highlights: z.array(z.string()),
        url: z.url(),
        github: z.url().nullable(),
      }),
    ),
  }),
});

export const collections = { cv };
