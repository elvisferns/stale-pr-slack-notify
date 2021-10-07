// import { axios } from "axios";

import { default as axios } from "axios";

// const pullStalePRs = () => {

// }

// const notifySlack = () => {

// }

const run = async () => {
  console.log("env variables", process.env);
  const queryParams = `q=is:pr repo:${process.env.GITHUB_REPOSITORY} state:open`;
  try {
    const res = await axios.get(`https://api.github.com/search/issues?${queryParams}`, {
      headers: {
        Accept: "application/vnd.github.v3.raw+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });
    console.log("file: index.js ~ line 18 ~ run ~ res", res);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
