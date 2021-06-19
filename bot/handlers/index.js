require("module-alias/register");
const { Intents, Collection } = require("discord.js"),
  express = require("express"),
  { Client, loadStructures } = require("@root/bot/Client.js"),
  config = require("@config"),
  intents = new Intents();
global._Collection = Collection;
loadStructures();
intents.add(
  "GUILD_PRESENCES",
  "GUILD_MEMBERS",
  "GUILDS",
  "GUILD_VOICE_STATES",
  "GUILD_MESSAGES",
  "GUILD_MESSAGE_REACTIONS"
);

const client = new Client(config, {
    intents: intents,
    allowedMentions: { parse: ["users"], repliedUser: false },
  }),
  app = express();

global.client = client;
// website initialization
if (client.config.website.enabled) {
  require("@root/website/index.js");
}
function init() {
  client.loadCommands();
  client.loadEvents();
  client.db.init();
  client.connect();
}

init();

(async () => {
  await client.loadTopgg();
})

process.on("unhandledRejection", (error) => client.logger.warn(error));
