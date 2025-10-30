require("dotenv").config();
require("module-alias/register");

require("@helpers/extenders/Message");
require("@helpers/extenders/Guild");
require("@helpers/extenders/GuildChannel");

const { BotClient } = require("@src/structures");
const { initializeMongoose } = require("@src/database/mongoose");
const { validateConfiguration } = require("@helpers/Validator");

validateConfiguration();

const client = new BotClient();

client.loadCommands("src/commands");
client.loadContexts("src/contexts");
client.loadEvents("src/events");

// get error
process.on("uncaughtException", (err) => {
  console.error(err);
});

// get promise error
process.on("unhandledRejection", (err) => {
  console.error(err);
});

(async () => {
  await initializeMongoose();

  await client.login(process.env.BOT_TOKEN);
})();
