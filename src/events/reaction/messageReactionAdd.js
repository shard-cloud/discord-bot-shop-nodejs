const { translationHandler } = require("@src/handlers");
const { getSettings } = require("@schemas/Guild");
const { isValidEmoji } = require("country-emoji-languages");

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').MessageReaction|import('discord.js').PartialMessageReaction} reaction
 * @param {import('discord.js').User|import('discord.js').PartialUser} user
 */
module.exports = async (client, reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (ex) {
      return; // Failed to fetch message (maybe deleted)
    }
  }

  if (user.partial) await user.fetch();

  const { message, emoji } = reaction;

  if (user.bot) return;

  // Handle Reaction Emojis
  if (!emoji.id) {
    const settings = await getSettings(message.guild);

    if (message.content && settings.flag_translation.enabled) {
      if (isValidEmoji(emoji.name)) {
        translationHandler.handleFlagReaction(emoji.name, message, user);
      }
    }
  }
};
