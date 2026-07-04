import { spawnSync } from "node:child_process";

import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const { stdout, stderr } = spawnSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
});
const revision = stdout.trim() || crypto.randomUUID();

if (!stdout.trim())
  console.warn(
    `Falling back to random UUID for Serwist revision: ${
      stderr.trim() || "Git revision is unavailable"
    }`,
  );
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/", revision }],
});

const nextConfig: NextConfig = {};

export default withSerwist(nextConfig);
