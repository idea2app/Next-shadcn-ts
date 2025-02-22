import type { MetadataRoute } from "next";

import { baseURL } from "@/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseURL,
      lastModified: new Date(),
    },
  ];
}
