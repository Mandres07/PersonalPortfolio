export type SocialIcon = Record<string, string | any>;

export interface ProjectImage {
    url: string;
    position: string;
    dark: string | null;
}

export interface Project {
    name: string;
    image: ProjectImage;
    isActive: boolean;
    description: string;
    highlights: string[];
    url: string;
    github: string | null;
}

export interface Reference {
    name: string;
    reference: string;
}

export interface Interest {
    name: string;
    keywords: string[];
}

export interface Language {
    language: string;
    fluency: string;
}

export interface Skill {
    name: string;
    icon: string;
    level: string;
    keywords: string[];
}

export interface Work {
    name: string;
    position: string;
    location_type: string;
    location: string;
    url: string | null;
    startDate: string;
    endDate: string | null;
    summary: string;
    highlights: string[];
    responsibilities: string[];
    achievements: string[];
    skills: {
        [key: string]: any;
    };
}

export interface Certificate {
    name: string;
    date: string;
    url: string;
    issuer: string;
}

export interface EducationEntry {
    institution: string;
    url: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
}

export interface ImageEntry {
    image: string;
    alt: string;
    desc: string;
}

export interface ImageList {
    intro: string;
    list: ImageEntry[];
}

export interface Location {
    address: string;
    city: string;
    countryCode: string;
    region: string;
}

export interface Profile {
    network: string;
    icon: string;
    username: string;
    url: string;
}

export interface Basics {
    name: string;
    label: string;
    image: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    theme: string;
    location: Location;
    profiles: Profile[];
}

export interface CV {
    analyticsCode: string;
    basics: Basics;
    images: ImageList;
    education: EducationEntry[];
    certificates: Certificate[];
    work: Work[];
    skills: Skill[];
    languages: Language[];
    interests: Interest[];
    references: Reference[];
    projects: Project[];
}