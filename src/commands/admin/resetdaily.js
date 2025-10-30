const { ApplicationCommandOptionType } = require("discord.js");
const { getMemberStats } = require("@schemas/MemberStats");
const EconomyUtils = require("@helpers/EconomyUtils");
const LogUtils = require("@helpers/LogUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "resetdaily",
  description: "resetar daily de um usuário (admin)",
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
        description: "usuário para resetar daily (opcional)",
        type: ApplicationCommandOptionType.User,
        required: false,
      },
    ],
  },

  async messageRun(message, args, data) {
    const targetUser = message.mentions.users.first() || message.author;
    const response = await resetDaily(message, targetUser);
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const targetUser = interaction.options.getUser("usuário") || interaction.user;
    const response = await resetDaily(interaction, targetUser);
    return interaction.followUp(response);
  },
};

async function resetDaily(context, targetUser) {
  try {
    // Get the correct user based on the context type
    const user = context.user || context.author;
    if (!user) {
      return {
        embeds: [EconomyUtils.createErrorEmbed("Erro de Usuário", "Não foi possível identificar o usuário.")],
      };
    }

    const memberStats = await getMemberStats(context.guild.id, targetUser.id);

    // Reset daily
    await memberStats.updateOne({
      $unset: {
        lastDaily: 1,
        dailyStreak: 1,
      },
    });

    const embed = EconomyUtils.createEmbed({
      title: "🔄 Daily Resetado!",
      description: `O daily de **${targetUser.username}** foi resetado com sucesso.`,
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
        name: "🔄 Status",
        value: "Daily resetado - pode usar `/daily` novamente",
        inline: true,
      },
      {
        name: "👮 Administrador",
        value: user.tag,
        inline: true,
      }
    );

    // Send log to the admin channel
    const logEmbed = LogUtils.createAdminLog({
      title: "🔄 Reset de Daily",
      description: `**${context.user?.tag || context.author?.tag}** resetou o daily de **${targetUser.tag}**`,
      user: targetUser,
      moderator: context.user || context.author,
      color: 0xe74c3c,
      fields: [
        {
          name: "🎯 Ação",
          value: "Reset do cooldown do daily",
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
      embeds: [EconomyUtils.createErrorEmbed("Erro ao Resetar Daily", `Ocorreu um erro: ${error.message}`)],
    };
  }
}
