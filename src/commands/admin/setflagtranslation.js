const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "setflagtranslation",
  description: "habilita ou desabilita a tradução por reação de bandeira",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    usage: "<on|off>",
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "status",
        description: "ativar ou desativar a tradução por bandeira",
        required: true,
        type: ApplicationCommandOptionType.Boolean,
      },
    ],
  },

  async messageRun(message, args, data) {
    const input = args[0].toLowerCase();
    if (!["on", "off"].includes(input)) {
      return message.safeReply("Use `on` ou `off` para ativar/desativar a tradução por bandeira");
    }

    const status = input === "on";
    const response = await setFlagTranslation(status, data.settings);
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const status = interaction.options.getBoolean("status");
    const response = await setFlagTranslation(status, data.settings);
    return interaction.followUp(response);
  },
};

async function setFlagTranslation(status, settings) {
  settings.flag_translation.enabled = status;
  await settings.save();
  return `Tradução por bandeira foi **${status ? "ativada" : "desativada"}** neste servidor.`;
}
