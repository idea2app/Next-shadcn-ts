import type { MetadataRoute } from "next";

import { baseURL } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/og", "/sitemap.xml", "/robots.txt"],
      disallow: ["/private/"],
    },
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
