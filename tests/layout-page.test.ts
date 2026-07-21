import { buildLayoutMetadata, getPlainSummary } from "@/lib/layout";

describe("layout metadata", () => {
  test("normalizes structured summary paragraphs", () => {
    expect(getPlainSummary(["Hello", "World"])).toBe("Hello World");
  });

  test("builds localized profile metadata with absolute URLs", () => {
    const metadata = buildLayoutMetadata({
      personName: "Mario",
      jobTitle: "Developer",
      lang: "es",
      image: "/images/avatar.webp",
      summary: ["Hello", "World"],
      url: "https://mandres.dev/es/",
      siteUrl: "https://mandres.dev/",
      profiles: [{ url: "https://github.com/example" }],
    });

    expect(metadata.absoluteImage).toBe(
      "https://mandres.dev/images/avatar.webp",
    );
    expect(metadata.plainSummary).toBe("Hello World");
    expect(metadata.twitterDomain).toBe("mandres.dev");
    expect(metadata.ogLocale).toBe("es_PA");
    expect(metadata.personSchema.mainEntity).toMatchObject({
      name: "Mario",
      jobTitle: "Developer",
      sameAs: ["https://github.com/example"],
    });
  });
});
