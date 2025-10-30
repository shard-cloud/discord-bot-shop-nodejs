const { ApplicationCommandOptionType } = require("discord.js");
const { getMemberStats } = require("@schemas/MemberStats");
const EconomyUtils = require("@helpers/EconomyUtils");
const LogUtils = require("@helpers/LogUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "resetcoins",
  description: "resetar moedas de um usuário (admin)",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "[@usuário]",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "usuário",
        description: "usuário para resetar moedas (opcional)",
        type: ApplicationCommandOptionType.User,
        required: false,
      },
    ],
  },

  async messageRun(message, args, data) {
    const targetUser = message.mentions.users.first() || message.author;
    const response = await resetCoins(message, targetUser);
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const targetUser = interaction.options.getUser("usuário") || interaction.user;
    const response = await resetCoins(interaction, targetUser);
    return interaction.followUp(response);
  },
};

async function resetCoins(context, targetUser) {
  try {
    // Get the correct user based on the context type
    const user = context.user || context.author;
    if (!user) {
      return {
        embeds: [EconomyUtils.createErrorEmbed("Erro de Usuário", "Não foi possível identificar o usuário.")],
      };
    }

    const memberStats = await getMemberStats(context.guild.id, targetUser.id, true);
    const oldBalance = memberStats.coin || 0;

    // Reset coins to 0
    await memberStats.updateOne({
      $set: {
        coin: 0,
      },
    });

    const embed = EconomyUtils.createEmbed({
      title: "🔄 Moedas Resetadas!",
      description: `As moedas de **${targetUser.username}** foram resetadas com sucesso.`,
      color: EconomyUtils.createEmbed().color,
      thumbnail: targetUser.displayAvatarURL({ dynamic: true }),
      footer: {
        text: `Resetado por: ${user.tag} • ${new Date().toLocaleDateString("pt-BR")}`,
        iconURL: context.guild.iconURL({ dynamic: true }),
      },
    });

    embed.addFields(
      {
        name: "👤 Usuário",
        value: `${targetUser.tag} (${targetUser.id})`,
        inline: true,
      },
      {
        name: "💰 Saldo Anterior",
        value: `**${oldBalance}** moedas`,
        inline: true,
      },
      {
        name: "💰 Novo Saldo",
        value: `**0** moedas`,
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
      title: "🔄 Reset de Moedas",
      description: `**${context.user?.tag || context.author?.tag}** resetou as moedas de **${targetUser.tag}**`,
      user: targetUser,
      moderator: context.user || context.author,
      color: 0xe74c3c,
      fields: [
        {
          name: "💰 Saldo Anterior",
          value: `**${oldBalance}** moedas`,
          inline: true,
        },
        {
          name: "🎯 Ação",
          value: "Reset de moedas para 0",
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
