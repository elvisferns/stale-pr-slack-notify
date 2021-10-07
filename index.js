// import { axios } from "axios";

import { default as axios } from "axios";

const pullStalePRs = async (repo, token) => {
  const queryParams = `q=is:pr repo:${repo} state:open`;
  const res = await axios.get(`https://api.github.com/search/issues?${queryParams}`, {
    headers: {
      Accept: "application/vnd.github.v3.raw+json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("file: index.js ~ line 18 ~ run ~ res", res.data);
};

// const notifySlack = () => {

// }

const run = async () => {
  console.log("env variables", process.env);
  try {
    await pullStalePRs(process.env.GITHUB_REPOSITORY, process.env.GITHUB_TOKEN);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

run();
