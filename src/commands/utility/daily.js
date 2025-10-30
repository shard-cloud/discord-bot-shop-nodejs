const { getMemberStats } = require("@schemas/MemberStats");
const EconomyUtils = require("@helpers/EconomyUtils");
const LogUtils = require("@helpers/LogUtils");
const mongoose = require("mongoose");

const economyConfig = require("@config/economy");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "daily",
  description: "receber suas moedas diárias",
  category: "UTILITY",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
  },

  async messageRun(message) {
    const response = await claimDaily(message);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    const response = await claimDaily(interaction);
    return interaction.followUp(response);
  },
};

async function claimDaily(context) {
  try {
    // Get correct user based on context type
    const user = context.user || context.author;
    if (!user) {
      return {
        embeds: [EconomyUtils.createErrorEmbed("Erro de Usuário", "Não foi possível identificar o usuário.")],
      };
    }

    const memberStats = await getMemberStats(context.guild.id, user.id);
    const now = new Date();
    const lastDaily = memberStats.lastDaily || new Date(0);

    const timeDiff = now.getTime() - lastDaily.getTime();
    const hoursLeft = 24 - timeDiff / (1000 * 60 * 60);

    if (hoursLeft > 0) {
      const embed = EconomyUtils.createEmbed({
        title: "⏰ Cooldown Ativo",
        description: "Você já coletou suas moedas diárias hoje!",
        color: EconomyUtils.createEmbed().color,
        thumbnail: user.displayAvatarURL({ dynamic: true }),
        footer: {
          text: `Use /daily novamente em ${Math.ceil(hoursLeft)} horas!`,
          iconURL: context.guild.iconURL({ dynamic: true }),
        },
      });

      embed.addFields(
        {
          name: "⏳ Tempo Restante",
          value: `**${Math.ceil(hoursLeft)} horas** e **${Math.ceil((hoursLeft % 1) * 60)} minutos**`,
          inline: true,
        },
        {
          name: "🕐 Próxima Coleta",
          value: `<t:${Math.floor((lastDaily.getTime() + 24 * 60 * 60 * 1000) / 1000)}:R>`,
          inline: true,
        }
      );

      return { embeds: [embed] };
    }

    // Calculate daily reward
    const level = memberStats.level || 1;
    const currentStreak = memberStats.dailyStreak || 0;
    const reward = EconomyUtils.calculateDailyReward(level, currentStreak);

    const newStreak = currentStreak + 1;

    const currentBalance = memberStats.coin || 0;

    const newBalance = currentBalance + reward.total;

    await memberStats.save();
    const MemberStatsModel = mongoose.model("member-stats");
    await MemberStatsModel.updateOne(
      { guild_id: context.guild.id, member_id: user.id },
      {
        $set: {
          coin: newBalance,
          lastDaily: now,
          dailyStreak: newStreak,
        },
      }
    );

    const newMemberStats = await getMemberStats(context.guild.id, user.id);

    const streakStatus = EconomyUtils.getStreakStatus(newStreak);

    const embed = EconomyUtils.createEmbed({
      title: "💰 Moedas Diárias Coletadas!",
      description: streakStatus.description,
      color: streakStatus.color,
      thumbnail: user.displayAvatarURL({ dynamic: true }),
      footer: {
        text: `Próxima coleta em 24 horas • Sequência: ${newStreak} dias`,
        iconURL: context.guild.iconURL({ dynamic: true }),
      },
    });

    embed.addFields(
      {
        name: "💎 Recompensa Base",
        value: `**${reward.base}** moedas`,
        inline: true,
      },
      {
        name: "⭐ Bônus de Nível",
        value: `**+${reward.levelBonus}** moedas (Nível ${level})`,
        inline: true,
      },
      {
        name: "🔥 Bônus de Sequência",
        value: `**+${reward.streakBonus}** moedas (${newStreak} dias)`,
        inline: true,
      },
      {
        name: "💰 Total Recebido",
        value: `**${EconomyUtils.formatNumber(reward.total)}** moedas`,
        inline: true,
      },
      {
        name: "💳 Novo Saldo",
        value: `**${EconomyUtils.formatNumber(newMemberStats.coin)}** moedas`,
        inline: true,
      },
      {
        name: "🔥 Sequência Atual",
        value: `**${newStreak}** dias consecutivos`,
        inline: true,
      }
    );

    const achievements = getStreakAchievements(newStreak);
    if (achievements.length > 0) {
      embed.addFields({
        name: "🏆 Conquistas Desbloqueadas",
        value: achievements.join("\n"),
        inline: false,
      });
    }

    const logEmbed = LogUtils.createEconomyLog({
      title: "💰 Recompensa Diária Coletada",
      description: `**${user.tag}** coletou **${EconomyUtils.formatNumber(reward.total)}** moedas de recompensa diária`,
      user: user,
      color: streakStatus.color,
      fields: [
        {
          name: "💰 Total Recebido",
          value: `**${EconomyUtils.formatNumber(reward.total)}** moedas`,
          inline: true,
        },
        {
          name: "🔥 Sequência",
          value: `**${newStreak}** dias consecutivos`,
          inline: true,
        },
        {
          name: "💳 Novo Saldo",
          value: `**${EconomyUtils.formatNumber(newMemberStats.coin)}** moedas`,
          inline: true,
        },
      ],
    });

    LogUtils.sendLog(context.guild, "economy", logEmbed).catch(() => {});

    return { embeds: [embed] };
  } catch (error) {
    return {
      embeds: [EconomyUtils.createErrorEmbed("Erro ao Coletar Moedas Diárias", `Ocorreu um erro: ${error.message}`)],
    };
  }
}

/**
 * Get streak achievements based on current streak
 * @param {number} streak - Current daily streak
 * @returns {string[]} Array of achievement titles
 */
function getStreakAchievements(streak) {
  return economyConfig.STREAK_ACHIEVEMENTS.filter((achievement) => streak >= achievement.days).map(
    (achievement) => achievement.title
  );
}
