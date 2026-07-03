import { githubClient, RepositoryModel } from "mobx-github";

const token = process.env.GITHUB_TOKEN;

githubClient.use(({ request }, next) => {
  if (token)
    request.headers = {
      Authorization: "Bearer " + token,
      ...request.headers,
    };

  return next();
});

export const repositoryStore = new RepositoryModel("idea2app");
