import { spawnSync } from "node:child_process";

import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const revisionResult = spawnSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
});
const revision = revisionResult.stdout.trim() || crypto.randomUUID();
if (!revisionResult.stdout.trim())
  console.warn(
    `Falling back to random UUID for Serwist revision: ${
      revisionResult.stderr.trim() || "git revision is unavailable"
    }`,
  );
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/", revision }],
});

const nextConfig: NextConfig = {};

export default withSerwist(nextConfig);
