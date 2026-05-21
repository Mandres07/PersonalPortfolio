export interface LayoutMetadataInput {
  personName: string;
  lang: string;
  image: string;
  summary: string;
  url: string;
  siteUrl: string;
}

export function getPlainSummary(summary: string): string {
  return summary.replace(/<br\s*\/?>/gi, " ").trim();
}

export function buildLayoutMetadata({
  personName,
  lang,
  image,
  summary,
  url,
  siteUrl,
}: LayoutMetadataInput) {
  const absoluteImage = new URL(image, siteUrl).toString();
  const plainSummary = getPlainSummary(summary);
  const twitterDomain = new URL(siteUrl).hostname;

  return {
    absoluteImage,
    plainSummary,
    twitterDomain,
    personSchema: {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      inLanguage: lang,
      mainEntity: {
        "@type": "Person",
        name: personName,
        description: plainSummary,
        url,
        image: absoluteImage,
      },
    },
  };
}
