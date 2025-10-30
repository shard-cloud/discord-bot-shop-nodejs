const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getCoinLb } = require("@schemas/MemberStats");
const EconomyUtils = require("@helpers/EconomyUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "rank",
  description: "ver o ranking de moedas do servidor",
  category: "UTILITY",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "[tipo] [página]",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "tipo",
        description: "tipo de ranking",
        type: ApplicationCommandOptionType.String,
        required: false,
        choices: [
          { name: "💰 Moedas", value: "coins" },
          { name: "📊 Nível", value: "level" },
          { name: "💬 Mensagens", value: "messages" },
        ],
      },
      {
        name: "página",
        description: "página para visualizar (padrão: 1)",
        type: ApplicationCommandOptionType.Number,
        required: false,
      },
    ],
  },

  async messageRun(message, args, data) {
    const type = args[0] || "coins";
    const page = parseInt(args[1]) || 1;
    const response = await getLeaderboard(message, type, page);
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const type = interaction.options.getString("tipo") || "coins";
    const page = interaction.options.getNumber("página") || 1;
    const response = await getLeaderboard(interaction, type, page);
    return interaction.followUp(response);
  },
};

async function getLeaderboard(context, type = "coins", page = 1) {
  try {
    const limit = 10;
    const skip = (page - 1) * limit;

    let leaderboardData;
    let title;
    let emoji;

    switch (type) {
      case "coins":
        leaderboardData = await getCoinLb(context.guild.id, limit);
        title = "💰 Ranking de Moedas";
        emoji = "💰";
        break;
      case "level":
        // For now, we'll use coins as a proxy for level since we don't have a separate level leaderboard
        leaderboardData = await getCoinLb(context.guild.id, limit);
        title = "📊 Ranking de Níveis";
        emoji = "⭐";
        break;
      case "messages":
        // This would need a separate function for message leaderboard
        leaderboardData = await getCoinLb(context.guild.id, limit);
        title = "💬 Ranking de Mensagens";
        emoji = "💬";
        break;
      default:
        leaderboardData = await getCoinLb(context.guild.id, limit);
        title = "💰 Ranking de Moedas";
        emoji = "💰";
    }

    if (leaderboardData.length === 0) {
      const embed = EconomyUtils.createEmbed({
        title: `${emoji} ${title}`,
        description: "📊 Nenhum dado encontrado para este ranking.",
        footer: {
          text: `Servidor: ${context.guild.name}`,
          iconURL: context.guild.iconURL({ dynamic: true }),
        },
      });

      return { embeds: [embed] };
    }

    const embed = EconomyUtils.createEmbed({
      title: `${emoji} ${title}`,
      footer: {
        text: `Página ${page} • Servidor: ${context.guild.name}`,
        iconURL: context.guild.iconURL({ dynamic: true }),
      },
    });

    let description = "";
    for (let i = 0; i < leaderboardData.length; i++) {
      const member = leaderboardData[i];
      const rank = skip + i + 1;

      try {
        const user = await context.client.users.fetch(member.member_id);
        const username = user.username;
        // const avatar = user.displayAvatarURL({ dynamic: true, size: 32 }); // Not used

        let value;
        let extraInfo = "";

        switch (type) {
          case "coins":
            value = `**${EconomyUtils.formatNumber(member.coin)}** moedas`;
            if (member.coin >= 1000000) extraInfo = " 🏆";
            else if (member.coin >= 100000) extraInfo = " 💎";
            else if (member.coin >= 10000) extraInfo = " 💰";
            break;
          case "level":
            value = `**Nível ${member.level || 1}** (${EconomyUtils.formatNumber(member.xp || 0)} XP)`;
            if (member.level >= 100) extraInfo = " 🏆";
            else if (member.level >= 50) extraInfo = " 💎";
            else if (member.level >= 20) extraInfo = " ⭐";
            break;
          case "messages":
            value = `**${EconomyUtils.formatNumber(member.messages || 0)}** mensagens`;
            if (member.messages >= 10000) extraInfo = " 🏆";
            else if (member.messages >= 5000) extraInfo = " 💎";
            else if (member.messages >= 1000) extraInfo = " 💬";
            break;
        }

        const medal = EconomyUtils.getRankingMedal(rank);
        description += `${medal} **${rank}º** ${username}${extraInfo}\n`;
        description += `└ ${value}\n\n`;
      } catch (error) {
        // User might have left the server
        const medal = EconomyUtils.getRankingMedal(rank);
        description += `${medal} **${rank}º** Usuário Desconhecido\n`;
        description += `└ ${
          type === "coins" ? `${EconomyUtils.formatNumber(member.coin)} moedas` : "Dados indisponíveis"
        }\n\n`;
      }
    }

    embed.setDescription(description);

    // Add server statistics
    const totalMembers = leaderboardData.length;
    const topMember = leaderboardData[0];

    embed.addFields(
      {
        name: "📊 Estatísticas do Servidor",
        value: `**Total de Membros:** ${totalMembers}\n**Maior Valor:** ${
          type === "coins" ? `${EconomyUtils.formatNumber(topMember.coin)} moedas` : `Nível ${topMember.level || 1}`
        }\n**Tipo:** ${EconomyUtils.getRankingTypeDescription(type)}`,
        inline: true,
      },
      {
        name: "🏆 Conquistas",
        value: EconomyUtils.getRankingAchievementInfo(type, topMember),
        inline: true,
      }
    );

    // Create navigation buttons
    const components = [];
    const row = new ActionRowBuilder();

    if (page > 1) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`leaderboard_prev_${type}_${page - 1}`)
          .setLabel("⬅️ Anterior")
          .setStyle(ButtonStyle.Secondary)
      );
    }

    if (leaderboardData.length === limit) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`leaderboard_next_${type}_${page + 1}`)
          .setLabel("Próxima ➡️")
          .setStyle(ButtonStyle.Secondary)
      );
    }

    if (row.components.length > 0) {
      components.push(row);
    }

    return { embeds: [embed], components };
  } catch (error) {
    return {
      embeds: [EconomyUtils.createErrorEmbed("Erro ao Consultar Ranking", `Ocorreu um erro: ${error.message}`)],
    };
  }
}
