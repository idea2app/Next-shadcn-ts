import {
  compose,
  OAuth2Props,
  ServerProps,
  withMiddleware,
} from "next-ssr-middleware";

import { GithubSessionUser, githubSigner } from "@/lib/OAuth";

type DashboardProps = ServerProps & OAuth2Props<GithubSessionUser>;

const DashboardPage = withMiddleware<{}, DashboardProps>(
  compose(githubSigner),
  Dashboard,
);
export default DashboardPage;

async function Dashboard({ user }: DashboardProps) {
  return (
    <main className="px-3">
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </main>
  );
}
