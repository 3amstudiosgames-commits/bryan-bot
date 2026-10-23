require("dotenv").config();

const axios = require("axios");
const { App, LogLevel } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: LogLevel.DEBUG // Add this line to log incoming events
});




app.command("/bryan-hodukavich-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond("Hello");
});
app.command("/bryan-hodukavich-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/bryan-hodukavich-weather - Get Weather and Temp
/bryan-hodukavich-funfact - Get a Fun fact
/bryan-hodukavich-catfact - Get a cat fact`
  });
});

app.command("/bryan-hodukavich-catfact", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});
app.command("/bryan-hodukavich-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();