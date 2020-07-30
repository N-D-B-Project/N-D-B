require("dotenv").config();
const { Client } = require("discord.js");
const { registerCommands, registerEvents } = require("./utils/registry");
const client = new Client();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/NDBase", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let subpasta = ["Accessibility", "Info", "Interaction", "Moderation", "test"];

subpasta.forEach((sub) => {
  try {
    let commandFile = require(`./Commands/${sub}/${command}.js`);
    delete require.cache[require.resolve(`./Commands/${sub}/${command}.js`)];
    return commandFile.run(client, message, args);
  } catch (err) {}
});

(async () => {
  client.commands = new Map();
  client.events = new Map();
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");
  await client.login(process.env.DISCORD_BOT_TOKEN);
  console.log("Hello World!");
})();
