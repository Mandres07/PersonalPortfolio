export interface LayoutMetadataInput {
  personName: string;
  jobTitle: string;
  lang: "en" | "es";
  image: string;
  summary: string[];
  url: string;
  siteUrl: string;
  profiles: Array<{ url: string }>;
}

export function getPlainSummary(summary: string[]): string {
  return summary.join(" ").trim();
}

export function buildLayoutMetadata({
  personName,
  jobTitle,
  lang,
  image,
  summary,
  url,
  siteUrl,
  profiles,
}: LayoutMetadataInput) {
  const absoluteImage = new URL(image, siteUrl).toString();
  const plainSummary = getPlainSummary(summary);
  const twitterDomain = new URL(siteUrl).hostname;

  return {
    absoluteImage,
    plainSummary,
    twitterDomain,
    ogLocale: lang === "es" ? "es_PA" : "en_US",
    alternateOgLocale: lang === "es" ? "en_US" : "es_PA",
    personSchema: {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      inLanguage: lang,
      mainEntity: {
        "@type": "Person",
        name: personName,
        jobTitle,
        description: plainSummary,
        url,
        image: absoluteImage,
        sameAs: profiles.map(({ url }) => url),
      },
    },
  };
}
