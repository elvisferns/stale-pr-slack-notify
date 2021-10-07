import { default as axios } from "axios";
import moment from "moment";
import colors from "./colors.js";

const pullStalePRs = async (repo, token, baseBranch) => {
  const queryParams = `q=is:pr repo:${repo} state:open base:${baseBranch}`;
  const res = await axios.get(`https://api.github.com/search/issues?${queryParams}`, {
    headers: {
      Accept: "application/vnd.github.v3.raw+json",
      Authorization: `Bearer ${token}`,
    },
  });

  // console.log("file: index.js ~ line 18 ~ run ~ res", colors.info(res.data));
  const { items = [] } = res.data;
  return items.map(({ html_url = "", title = "", user: { login: user = "" } = {}, updated_at }) => ({
    pullURL: html_url,
    pullTitle: title,
    user,
    lastUpdateAt: moment(updated_at).format("MMM Do YYYY"),
  }));
};

const processSlackNotification = async (stalePRs = []) => {
  if (Array.isArray(stalePRs) && stalePRs.length > 0) {
    while (stalePRs.length > 0) {
      const processPRs = stalePRs.splice(0, 10);
      await Promise.all(
        processPRs.map(({ user = "", pullTitle = "", lastUpdateAt = "", pullURL = "" }) => {
          const payload = {
            blocks: [
              {
                type: "header",
                text: {
                  type: "plain_text",
                  text: `Stale Pull Request on repo`,
                },
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*User:* ${user}`,
                },
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*Title:* ${pullTitle}`,
                },
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*Last updated at:* ${lastUpdateAt}`,
                },
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `<${pullURL}|View pull request>`,
                },
              },
            ],
          };
          return notifySlack(pullURL, payload);
        })
      );
    }
  }
};

const notifySlack = async (pullURL, payload) => {
  try {
    const res = await axios.post(`${process.env.slack_web_hook}`, payload);
    console.log(`Pull request ${pullURL} processed sucessfully`);
    return res.data;
  } catch (error) {
    console.error(`Pull request ${pullURL} processed with error ${error.message}`);
    throw error;
  }
};

const run = async () => {
  try {
    const stalePRs = await pullStalePRs(process.env.GITHUB_REPOSITORY, process.env.GITHUB_TOKEN, process.env.BASE_BRANCH);
    if (stalePRs && stalePRs.length > 0) {
      await processSlackNotification(stalePRs);
    }
  } catch (error) {
    console.error(colors.error(error));
    process.exit(1);
  }
};

run();
