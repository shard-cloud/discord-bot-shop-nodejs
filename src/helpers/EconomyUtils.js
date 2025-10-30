const { EmbedBuilder } = require("discord.js");
const economyConfig = require("@config/economy");

/**
 * Utility for the Economy System
 * Modular and reusable
 */
class EconomyUtils {
  /**
   * Get the wealth status based on the amount of coins
   * @param {number} coins - Amount of coins
   * @returns {Object} Wealth status
   */
  static getWealthStatus(coins) {
    const statuses = economyConfig.WEALTH_STATUS;

    for (const [key, status] of Object.entries(statuses)) {
      if (coins >= status.min) {
        return {
          key,
          ...status,
          description: `${status.emoji} **${status.title}** ${this.getWealthDescription(coins)}`,
        };
      }
    }

    return statuses.POBRE;
  }

  /**
   * Get wealth description based on the amount of coins
   * @param {number} coins - Amount of coins
   * @returns {string} Wealth description
   */
  static getWealthDescription(coins) {
    const wealthTier = this.getWealthTier(coins);
    return wealthTier.description;
  }

  /**
   * Get wealth tier configuration
   * @param {number} coins - Amount of coins
   * @returns {Object} Wealth tier object
   */
  static getWealthTier(coins) {
    return (
      economyConfig.WEALTH_TIERS.find((tier) => coins >= tier.minCoins) ||
      economyConfig.WEALTH_TIERS[economyConfig.WEALTH_TIERS.length - 1]
    );
  }

  /**
   * Get the daily streak status
   * @param {number} streak - Days of streak
   * @returns {Object} Daily streak status
   */
  static getStreakStatus(streak) {
    return (
      economyConfig.STREAK_STATUS.find((status) => streak >= status.minDays) ||
      economyConfig.STREAK_STATUS[economyConfig.STREAK_STATUS.length - 1]
    );
  }

  /**
   * Get the streak description based on the days of streak
   * @param {number} streak - Days of streak
   * @returns {string} Streak description
   */
  static getStreakDescription(streak) {
    const streakStatus = this.getStreakStatus(streak);
    return streakStatus.description;
  }

  /**
   * Get the streak status configuration
   * @param {number} streak - Days of streak
   * @returns {Object} Streak status object
   */
  static getStreakStatus(streak) {
    return (
      economyConfig.STREAK_STATUS.find((status) => streak >= status.minDays) ||
      economyConfig.STREAK_STATUS[economyConfig.STREAK_STATUS.length - 1]
    );
  }

  /**
   * Get the achievements based on the user statistics
   * @param {Object} stats - User statistics
   * @returns {Array} List of achievements
   */
  static getAchievements(stats) {
    const achievements = [
      ...this.getInventoryAchievements(stats.totalItems),
      ...this.getSpendingAchievements(stats.totalSpent),
      ...this.getLoyaltyAchievements(stats.uniqueProducts),
    ];

    return achievements.length > 0 ? achievements : ["🎯 **Novo Cliente**"];
  }

  /**
   * Get the inventory-based achievements
   * @param {number} totalItems - Total items owned
   * @returns {Array} Inventory achievements
   */
  static getInventoryAchievements(totalItems) {
    return Object.values(economyConfig.ACHIEVEMENTS.INVENTORY)
      .filter((achievement) => totalItems >= achievement.min)
      .map((achievement) => `${achievement.emoji} **${achievement.title}**`);
  }

  /**
   * Get the spending-based achievements
   * @param {number} totalSpent - Total amount spent
   * @returns {Array} Spending achievements
   */
  static getSpendingAchievements(totalSpent) {
    return Object.values(economyConfig.ACHIEVEMENTS.SPENDING)
      .filter((achievement) => totalSpent >= achievement.min)
      .map((achievement) => `${achievement.emoji} **${achievement.title}**`);
  }

  /**
   * Get the loyalty-based achievements
   * @param {number} uniqueProducts - Number of unique products bought
   * @returns {Array} Loyalty achievements
   */
  static getLoyaltyAchievements(uniqueProducts) {
    return Object.values(economyConfig.ACHIEVEMENTS.LOYALTY)
      .filter((achievement) => uniqueProducts >= achievement.min)
      .map((achievement) => `${achievement.emoji} **${achievement.title}**`);
  }

  /**
   * Get the transfer status based on the amount
   * @param {number} amount - Amount transferred
   * @returns {Object} Transfer status
   */
  static getTransferStatus(amount) {
    return (
      Object.values(economyConfig.TRANSFER).find((status) => amount >= status.min) || economyConfig.TRANSFER.PEQUENA
    );
  }

  /**
   * Get the transfer description based on the amount transferred
   * @param {number} amount - Amount transferred
   * @returns {string} Transfer description
   */
  static getTransferDescription(amount) {
    const transferStatus = this.getTransferStatus(amount);
    return transferStatus.description;
  }

  /**
   * Create the progress bar
   * @param {number} current - Valor atual
   * @param {number} max - Maximum value
   * @param {number} length - Length of the progress bar
   * @returns {string} Barra de progresso
   */
  static createProgressBar(current, max, length = economyConfig.UI.PROGRESS_BAR.LENGTH) {
    const progress = Math.min(current / max, 1);
    const filled = Math.floor(progress * length);
    const empty = length - filled;

    return `\`${economyConfig.UI.PROGRESS_BAR.FILLED.repeat(filled)}${economyConfig.UI.PROGRESS_BAR.EMPTY.repeat(
      empty
    )}\` ${Math.floor(progress * 100)}%`;
  }

  /**
   * Get the medal based on the position in the ranking
   * @param {number} rank - Position in the ranking
   * @returns {string} Medal emoji
   */
  static getRankingMedal(rank) {
    const medals = economyConfig.RANKING.MEDALS;
    return medals[rank] || medals.DEFAULT;
  }

  /**
   * Format the number with separators
   * @param {number} number - Number to format
   * @returns {string} Formatted number
   */
  static formatNumber(number) {
    return number.toLocaleString("pt-BR");
  }

  /**
   * Calculate the XP needed for the next level
   * @param {number} level - Current level
   * @returns {number} XP needed
   */
  static getXpNeededForNextLevel(level) {
    return economyConfig.LEVELS.XP_PER_LEVEL(level);
  }

  /**
   * Calculate the level progress
   * @param {number} currentXp - Current XP
   * @param {number} level - Current level
   * @returns {Object} Level progress
   */
  static getLevelProgress(currentXp, level) {
    const xpNeeded = this.getXpNeededForNextLevel(level);
    const progress = Math.floor((currentXp / xpNeeded) * 100);

    return {
      current: currentXp,
      needed: xpNeeded,
      progress,
      bar: this.createProgressBar(currentXp, xpNeeded),
    };
  }

  /**
   * Create the base embed with default configurations
   * @param {Object} options - Options for the embed
   * @returns {EmbedBuilder} Configured embed
   */
  static createEmbed(options = {}) {
    const embed = new EmbedBuilder()
      .setColor(options.color || economyConfig.UI.EMBEDS.COLORS.INFO)
      .setTimestamp(options.timestamp !== false ? new Date() : null);

    if (options.title) embed.setTitle(options.title);
    if (options.description) embed.setDescription(options.description);
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);
    if (options.footer) embed.setFooter(options.footer);

    return embed;
  }

  /**
   * Create the error embed
   * @param {string} title - Error title
   * @param {string} description - Error description
   * @returns {EmbedBuilder} Error embed
   */
  static createErrorEmbed(title, description) {
    return this.createEmbed({
      title: `❌ ${title}`,
      description,
      color: economyConfig.UI.EMBEDS.COLORS.ERROR,
    });
  }

  /**
   * Create the success embed
   * @param {string} title - Success title
   * @param {string} description - Success description
   * @returns {EmbedBuilder} Success embed
   */
  static createSuccessEmbed(title, description) {
    return this.createEmbed({
      title: `✅ ${title}`,
      description,
      color: economyConfig.UI.EMBEDS.COLORS.SUCCESS,
    });
  }

  /**
   * Create the warning embed
   * @param {string} title - Warning title
   * @param {string} description - Warning description
   * @returns {EmbedBuilder} Warning embed
   */
  static createWarningEmbed(title, description) {
    return this.createEmbed({
      title: `⚠️ ${title}`,
      description,
      color: economyConfig.UI.EMBEDS.COLORS.WARNING,
    });
  }

  /**
   * Validate if a user can receive coins
   * @param {number} amount - Amount to be transferred
   * @returns {Object} Validation result
   */
  static validateTransfer(amount) {
    if (amount <= 0) {
      return { valid: false, error: "A quantia deve ser positiva." };
    }

    if (amount > economyConfig.COINS.MAX_GIVE_AMOUNT) {
      return {
        valid: false,
        error: `Você não pode transferir mais de ${this.formatNumber(
          economyConfig.COINS.MAX_GIVE_AMOUNT
        )} moedas de uma vez.`,
      };
    }

    return { valid: true };
  }

  /**
   * Calculate the daily reward
   * @param {number} level - User level
   * @param {number} streak - Current streak
   * @returns {Object} Daily reward calculation
   */
  static calculateDailyReward(level, streak) {
    const base = economyConfig.COINS.DAILY_BASE;
    const levelBonus = Math.floor(level * economyConfig.COINS.DAILY_LEVEL_MULTIPLIER);
    const streakBonus = Math.floor(streak * economyConfig.COINS.DAILY_STREAK_MULTIPLIER);
    const total = base + levelBonus + streakBonus;

    return {
      base,
      levelBonus,
      streakBonus,
      total,
    };
  }

  /**
   * Get the ranking type description
   * @param {string} type - Ranking type
   * @returns {string} Ranking type description
   */
  static getRankingTypeDescription(type) {
    const types = economyConfig.RANKING.TYPES;
    return types[type.toUpperCase()]?.description || "Desconhecido";
  }

  /**
   * Get ranking achievement info for top member
   * @param {string} type - Ranking type
   * @param {Object} topMember - Top ranking member
   * @returns {string} Achievement information
   */
  static getRankingAchievementInfo(type, topMember) {
    const config = economyConfig.RANKING.ACHIEVEMENTS[type] || economyConfig.RANKING.ACHIEVEMENTS.coins;
    const value = config.getValue(topMember);

    const threshold = config.thresholds.find((t) => value >= t.min);
    return threshold ? threshold.achievements.join("\n") : "🎯 **Ativo**\n🌱 **Novato**\n💫 **Iniciante**";
  }
}

module.exports = EconomyUtils;
