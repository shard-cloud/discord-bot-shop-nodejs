const { ApplicationCommandOptionType } = require("discord.js");
const EconomyUtils = require("@helpers/EconomyUtils");
const LogUtils = require("@helpers/LogUtils");
const mongoose = require("mongoose");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "resetallcoins",
  description: "resetar moedas de todos os usuários para 0 (admin)",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "[confirm]",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "confirm",
        description: "digite 'confirm' para confirmar o reset",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async messageRun(message, args, data) {
    const confirm = args[0]?.toLowerCase();
    const response = await resetAllCoins(message, confirm);
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const confirm = interaction.options.getString("confirm")?.toLowerCase();
    const response = await resetAllCoins(interaction, confirm);
    return interaction.followUp(response);
  },
};

async function resetAllCoins(context, confirm) {
  try {
    if (confirm !== "confirm") {
      return {
        embeds: [
          EconomyUtils.createWarningEmbed(
            "⚠️ Confirmação Necessária",
            "Este comando irá resetar as moedas de TODOS os usuários para 0. Para confirmar, use o parâmetro 'confirm'."
          ),
        ],
      };
    }

    // Reset all coins directly in the database
    const MemberStatsModel = mongoose.model("member-stats");
    const result = await MemberStatsModel.updateMany({ guild_id: context.guild.id }, { $set: { coin: 0 } });

    const embed = EconomyUtils.createEmbed({
      title: "🔄 Todas as Moedas Resetadas!",
      description: `Todas as moedas do servidor foram resetadas para 0.`,
      color: EconomyUtils.createEmbed().color,
      thumbnail: context.guild.iconURL({ dynamic: true }),
      footer: {
        text: `Resetado por: ${context.user?.tag || context.author?.tag} • ${new Date().toLocaleDateString("pt-BR")}`,
        iconURL: context.guild.iconURL({ dynamic: true }),
      },
    });

    embed.addFields(
      {
        name: "🔢 Total de Usuários Afetados",
        value: `**${result.modifiedCount}** usuários`,
        inline: true,
      },
      {
        name: "🎯 Status",
        value: "✅ **Sucesso**",
        inline: true,
      }
    );

    // Send log to the admin channel
    const logEmbed = LogUtils.createAdminLog({
      title: "🔄 Reset de Todas as Moedas",
      description: `**${context.user?.tag || context.author?.tag}** resetou as moedas de todos os usuários do servidor`,
      moderator: context.user || context.author,
      color: 0xe74c3c,
      fields: [
        {
          name: "🔢 Usuários Afetados",
          value: `**${result.modifiedCount}** usuários`,
          inline: true,
        },
        {
          name: "🎯 Ação",
          value: "Reset de todas as moedas para 0",
          inline: true,
        },
        {
          name: "🕒 Data",
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: false,
        },
      ],
    });

    // Send to the admin log channel
    await LogUtils.sendLog(context.guild, "admin", logEmbed);

    return { embeds: [embed] };
  } catch (error) {
    return {
      embeds: [EconomyUtils.createErrorEmbed("Erro ao Resetar Moedas", `Ocorreu um erro: ${error.message}`)],
    };
  }
}
