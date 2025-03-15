import type { MetadataRoute } from "next";

import { baseURL } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
