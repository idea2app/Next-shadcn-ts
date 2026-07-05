import { spawnSync } from "node:child_process";

import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const { stdout, stderr } = spawnSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
});
const { GITHUB_SHA, VERCEL_GIT_COMMIT_SHA } = process.env;
const revision =
  stdout.trim() || VERCEL_GIT_COMMIT_SHA || GITHUB_SHA || crypto.randomUUID();

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
