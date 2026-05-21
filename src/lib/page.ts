export function getSiteUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

export function buildPageUrls(siteUrl: string, lang: string) {
  const normalizedSiteUrl = getSiteUrl(siteUrl);
  const currentPath = lang === "es" ? "/es/" : "/";

  return {
    siteUrl: normalizedSiteUrl,
    currentUrl: new URL(currentPath, normalizedSiteUrl).toString(),
    alternateUrls: {
      en: new URL("/", normalizedSiteUrl).toString(),
      es: new URL("/es/", normalizedSiteUrl).toString(),
    },
  };
}
