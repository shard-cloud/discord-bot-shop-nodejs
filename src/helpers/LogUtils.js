const { EmbedBuilder } = require("discord.js");
const { getSettings } = require("@schemas/Guild");

/**
 * Utilitário para enviar logs para os canais configurados
 */
class LogUtils {
  /**
   * Envia um log para o canal configurado
   * @param {import('discord.js').Guild} guild - O servidor
   * @param {string} type - Tipo de log: "shop", "economy" ou "admin"
   * @param {import('discord.js').EmbedBuilder|Object} embed - O embed para enviar
   * @returns {Promise<boolean>} - Se o log foi enviado com sucesso
   */
  static async sendLog(guild, type, embed) {
    if (!guild || !type || !embed) return false;

    try {
      // Obter configurações do servidor
      const settings = await getSettings(guild);

      // Verificar se os logs estão habilitados
      if (!settings.logs?.enabled) {
        return false;
      }

      // Obter ID do canal configurado
      let channelId;
      switch (type.toLowerCase()) {
        case "shop":
          channelId = settings.logs.shop;
          break;
        case "economy":
          channelId = settings.logs.economy;
          break;
        case "admin":
          channelId = settings.logs.admin;
          break;
        default:
          return false;
      }

      // Verificar se existe um canal configurado
      if (!channelId) {
        return false;
      }

      // Tentar enviar para o canal configurado
      const channel = guild.channels.cache.get(channelId);
      if (!channel) {
        return false;
      }

      // Converter objeto para EmbedBuilder se necessário
      const embedToSend = embed instanceof EmbedBuilder ? embed : new EmbedBuilder(embed);

      await channel.send({ embeds: [embedToSend] });
      return true;
    } catch (error) {
      console.error(`Erro ao enviar log (${type}):`, error);
      return false;
    }
  }

  // O método getFallbackChannels foi removido, pois não utilizaremos mais canais de fallback

  /**
   * Cria um embed de log para comandos de economia
   * @param {Object} options - Opções do embed
   * @returns {EmbedBuilder} - O embed criado
   */
  static createEconomyLog(options) {
    const {
      title,
      description,
      user,
      moderator,
      fields = [],
      color = 0x3498db,
      thumbnail = null,
      footer = null,
    } = options;

    const embed = new EmbedBuilder()
      .setTitle(title || "📊 Log de Economia")
      .setColor(color)
      .setTimestamp();

    if (description) embed.setDescription(description);

    if (user) {
      embed.addFields({
        name: "👤 Usuário",
        value: `${user.tag} (${user.id})`,
        inline: true,
      });

      if (!thumbnail && user.displayAvatarURL) {
        embed.setThumbnail(user.displayAvatarURL({ dynamic: true }));
      }
    }

    if (moderator) {
      embed.addFields({
        name: "👮 Moderador",
        value: `${moderator.tag || moderator} (${moderator.id || "N/A"})`,
        inline: true,
      });
    }

    // Adicionar campos personalizados
    fields.forEach((field) => embed.addFields(field));

    // Thumbnail personalizado
    if (thumbnail) embed.setThumbnail(thumbnail);

    // Footer personalizado
    if (footer) {
      embed.setFooter(footer);
    }

    return embed;
  }

  /**
   * Cria um embed de log para comandos administrativos
   * @param {Object} options - Opções do embed
   * @returns {EmbedBuilder} - O embed criado
   */
  static createAdminLog(options) {
    const {
      title,
      description,
      user,
      moderator,
      fields = [],
      color = 0xe74c3c,
      thumbnail = null,
      footer = null,
    } = options;

    const embed = new EmbedBuilder()
      .setTitle(title || "⚙️ Log Administrativo")
      .setColor(color)
      .setTimestamp();

    if (description) embed.setDescription(description);

    if (user) {
      embed.addFields({
        name: "👤 Usuário Afetado",
        value: `${user.tag} (${user.id})`,
        inline: true,
      });

      if (!thumbnail && user.displayAvatarURL) {
        embed.setThumbnail(user.displayAvatarURL({ dynamic: true }));
      }
    }

    if (moderator) {
      embed.addFields({
        name: "👮 Executado Por",
        value: `${moderator.tag || moderator} (${moderator.id || "N/A"})`,
        inline: true,
      });
    }

    // Adicionar campos personalizados
    fields.forEach((field) => embed.addFields(field));

    // Thumbnail personalizado
    if (thumbnail) embed.setThumbnail(thumbnail);

    // Footer personalizado
    if (footer) {
      embed.setFooter(footer);
    }

    return embed;
  }
}

module.exports = LogUtils;
