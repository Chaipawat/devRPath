import type { MetadataRoute } from "next";
import { getAllParts } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    ...getAllParts().map((part) => ({
      url: `${siteUrl}/part/${part.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
