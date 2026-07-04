import { spawnSync } from "node:child_process";

import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).stdout.trim() ||
  crypto.randomUUID();
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/", revision }],
});

const nextConfig: NextConfig = {};

export default withSerwist(nextConfig);
