import { components } from "@octokit/openapi-types";
import { githubOAuth2 } from "next-ssr-middleware";

export type GithubSessionUser = components["schemas"]["private-user"];

const client_id = process.env.GITHUB_OAUTH_CLIENT_ID!,
  client_secret = process.env.GITHUB_OAUTH_CLIENT_SECRET!;

export const githubSigner = githubOAuth2({
  client_id,
  client_secret,
  scopes: ["user:email", "read:user"],
});
