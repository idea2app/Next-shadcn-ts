import type { MetadataRoute } from "next";

import { baseURL } from "@/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseURL,
      lastModified: new Date(),
      alternates: {
        languages: {
          "en-US": `${baseURL}/en-US`,
          "zh-CN": `${baseURL}/zh-CN`,
          "zh-TW": `${baseURL}/zh-TW`,
        },
      },
    },
  ];
}
