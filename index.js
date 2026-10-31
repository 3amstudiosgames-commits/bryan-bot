require("dotenv").config();

const axios = require("axios");
const { App, LogLevel } = require("@slack/bolt");

const weather = process.env.WEATHER_KEY;
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: LogLevel.DEBUG // Add this line to log incoming events
});

/*
Bryan's Commands:
------------------------
/bryan-hodukavich-ping
/bryan-hodukavich-help
/bryan-hodukavich-hi
/bryan-hodukavich-catfact
/bryan-hodukavich-joke
/bryan-hodukavich-remind-me
*/




//command codes---------------------------------------------------------------------------------------------------------
app.command("/bryan-hodukavich-hi", async ({ command, ack, respond }) => {
  await ack();
  const list_hi = ["What's up!", "Yo!", "Hey!", "Hi!"];
  const random_hi = list_hi[Math.floor(Math.random() * list_hi.length)];
  await respond(random_hi);
});

console.log(random_hi);
  await respond(random_hi);
});
app.command("/bryan-hodukavich-ping", async ({ command, ack, respond }) => {//Get ping
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});
app.command("/bryan-hodukavich-help", async ({ ack, respond }) => {//Dictionary of everything Bryan can do
  await ack();
  await respond({
    text:
`Available Commands:
--------------------------------
/bryan-hodukavich-hi - Say hi!
/bryan-hodukavich-weather - Get Weather and Temp (ex:/weather London)
/bryan-hodukavich-funfact - Get a Fun fact
/bryan-hodukavich-catfact - Get a cat fact
/bryan-hodukavich-remind-me - Tell Bryan to remind you in 2 min to wash plates: (ex:/remind-me 2 wash plates)`
  });
});
app.command("/bryan-hodukavich-catfact", async ({ ack, respond }) => {//Get a cat fact
  await ack();
  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});
app.command("/bryan-hodukavich-joke", async ({ ack, respond }) => {//Get a joke
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({text:"Failed to fetch a joke."});
  }
});
app.command("/bryan-hodukavich-remind-me",async ({ command, ack, respond, client }) => {// Make a simple reminder
  await ack();

  const args = command.text.trim().split(/\s+/);
  const minutes = parseInt(args[0], 10);
  const reminderText = args.slice(1).join(" ");

  if (isNaN(minutes) ||minutes < 2||!reminderText) {
    await respond({
      text:'Usage: `/bryan-hodukavich-remind-me[minutes][message]`',
      response_type: 'ephemeral'
    });
    return;
  }

  const postAt= Math.floor(Date.now()/1000)+(minutes*60);

  try {
    await client.chat.scheduleMessage({
      channel: command.channel_id,
      post_at: postAt,
      text: `Reminder for <@${command.user_id}>: *${reminderText}*`
    });
    await respond({
      text: `Yep! I will remind you to "*${reminderText}*" in ${minutes} minute(s).`,
      response_type: 'ephemeral'
    });
  } catch (error) {
    console.error(error);
    await respond({
      text: 'Nop! Make sure the time is between 120 seconds and 120 days from today~!',
      response_type: 'ephemeral'
    });
  }
});
app.command("/bryan-hodukavich-weather", async ({ command, ack, respond }) => {//Get weather
  await ack();
  const user = command.text ? command.text.trim() : "";

  const city = user.length > 0 ? user : "Tokyo";
  try {
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${weather}&units=metric`;
    
    const response = await axios.get(url);
    const data = response.data;

    const temp = data.main.temp;
    const desc = data.weather[0].description;
    const cityName = data.name;
    const country = data.sys.country;








    await respond({
      response_type: 'in_channel',
      text: `Current weather in *${cityName}, ${country}*: *${temp}°C* with ${desc}.`
    });
  } catch (error) {
    await respond({
      text: `Oopsies.. I couldn't find the information for *${city}*. Please check the spelling!`
    });
  }
});





//Is it running? Check
(async () => {
  await app.start();
  console.log("bot is running!");
  console.log(weather);
})();
