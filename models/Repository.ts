import { githubClient, RepositoryModel } from "mobx-github";

githubClient.use(({ request }, next) => {
  const token = process.env.GITHUB_TOKEN;

  if (token)
    request.headers = {
      ...request.headers,
      Authorization: "Bearer " + token,
    };

  return next();
});

export const repositoryStore = new RepositoryModel("idea2app");
