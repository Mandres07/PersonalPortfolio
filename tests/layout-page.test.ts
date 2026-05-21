import { buildLayoutMetadata, getPlainSummary } from "@/lib/layout";
import { buildPageUrls, getSiteUrl } from "@/lib/page";

describe("layout and page helpers", () => {
  test("normalizes the summary for metadata", () => {
    expect(getPlainSummary("Hello<br/>World")).toBe("Hello World");
  });

  test("builds layout metadata with absolute URLs", () => {
    const metadata = buildLayoutMetadata({
      personName: "Mario",
      lang: "en",
      image: "/images/avatar.webp",
      summary: "Hello<br/>World",
      url: "https://mandres.dev/",
      siteUrl: "https://mandres.dev/",
    });

    expect(metadata.absoluteImage).toBe("https://mandres.dev/images/avatar.webp");
    expect(metadata.plainSummary).toBe("Hello World");
    expect(metadata.twitterDomain).toBe("mandres.dev");
    expect(metadata.personSchema.mainEntity.name).toBe("Mario");
  });

  test("builds canonical and alternate page URLs", () => {
    expect(getSiteUrl("https://mandres.dev")).toBe("https://mandres.dev/");

    const urls = buildPageUrls("https://mandres.dev", "es");
    expect(urls.currentUrl).toBe("https://mandres.dev/es/");
    expect(urls.alternateUrls.en).toBe("https://mandres.dev/");
    expect(urls.alternateUrls.es).toBe("https://mandres.dev/es/");
  });
});
