const { ApplicationCommandOptionType, ChannelType, EmbedBuilder } = require("discord.js");
const { getSettings } = require("@schemas/Guild");
const LogUtils = require("@helpers/LogUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "setlogchannel",
  description: "configurar canais de log",
  category: "ADMIN",
  userPermissions: ["Administrator"],
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "<tipo> <#canal>",
    minArgsCount: 2,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "tipo",
        description: "tipo de canal de log",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          {
            name: "Logs da Loja",
            value: "shop",
          },
          {
            name: "Logs de Economia",
            value: "economy",
          },
          {
            name: "Logs de Admin",
            value: "admin",
          },
        ],
      },
      {
        name: "canal",
        description: "canal para logs",
        type: ApplicationCommandOptionType.Channel,
        channelTypes: [ChannelType.GuildText],
        required: true,
      },
    ],
  },

  async messageRun(message, args, data) {
    const type = args[0]?.toLowerCase();
    const channel = message.mentions.channels.first();

    if (!type || !channel) {
      return message.safeReply("❌ Uso incorreto. Exemplo: `/setlogchannel shop #canal-de-logs`");
    }

    if (!["shop", "economy", "admin"].includes(type)) {
      return message.safeReply("❌ Tipo inválido. Use: shop, economy ou admin");
    }

    const response = await setLogChannel(message, type, channel, message.author);
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const type = interaction.options.getString("tipo");
    const channel = interaction.options.getChannel("canal");
    const response = await setLogChannel(interaction, type, channel, interaction.user);
    return interaction.followUp(response);
  },
};

/**
 * @param {import('discord.js').CommandInteraction|import('discord.js').Message} context
 * @param {string} type
 * @param {import('discord.js').GuildChannel} channel
 * @param {import('discord.js').User} user
 */
async function setLogChannel(context, type, channel, user) {
  try {
    const guild = context.guild;
    const settings = await getSettings(guild);

    // Check bot permissions in the channel
    if (!channel.permissionsFor(guild.members.me).has(["ViewChannel", "SendMessages", "EmbedLinks"])) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("❌ Permissões Insuficientes")
        .setDescription(
          `Não tenho permissões suficientes no canal ${channel}. Preciso das seguintes permissões:\n` +
            `• Ver Canal\n` +
            `• Enviar Mensagens\n` +
            `• Incorporar Links`
        );

      return { embeds: [embed] };
    }

    // Update settings
    if (!settings.logs) {
      settings.logs = {
        enabled: true,
      };
    }

    // Set the specific channel
    settings.logs[type] = channel.id;
    settings.logs.enabled = true;

    // If it's the first configuration, mark as setup completed
    if (!settings.setup?.completed) {
      settings.setup = {
        completed: true,
        completed_at: new Date(),
        completed_by: user.id,
      };
    }

    await settings.save();

    // Create admin log
    const logEmbed = LogUtils.createAdminLog({
      title: "⚙️ Canal de Logs Configurado",
      description: `**${user.tag}** configurou o canal de logs para **${getLogTypeName(type)}**`,
      moderator: user,
      color: 0x2ecc71,
      fields: [
        {
          name: "📊 Tipo de Log",
          value: getLogTypeName(type),
          inline: true,
        },
        {
          name: "📝 Canal",
          value: `${channel} (${channel.id})`,
          inline: true,
        },
        {
          name: "🕒 Data",
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: false,
        },
      ],
    });

    // Try to send log to the admin channel
    if (type !== "admin") {
      // If we're not configuring the admin channel, try to send log to the admin channel
      const adminLogId = settings.logs.admin;
      if (adminLogId) {
        const adminChannel = guild.channels.cache.get(adminLogId);
        if (adminChannel) {
          try {
            await adminChannel.send({ embeds: [logEmbed] });
          } catch (logError) {
            console.error("Erro ao enviar log de configuração:", logError);
          }
        }
      }
    }

    // Send test message to the channel
    const testEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("✅ Canal de Logs Configurado")
      .setDescription(`Este canal foi configurado como canal de logs para **${getLogTypeName(type)}**`)
      .setFooter({ text: `Configurado por ${user.tag}`, iconURL: user.displayAvatarURL() })
      .setTimestamp();

    await channel.send({ embeds: [testEmbed] });

    // Respond to the command
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("✅ Canal de Logs Configurado")
      .setDescription(
        `O canal ${channel} foi configurado com sucesso para **${getLogTypeName(type)}**.\n` +
          `Uma mensagem de teste foi enviada no canal.`
      )
      .setFooter({ text: `Configurado por ${user.tag}`, iconURL: user.displayAvatarURL() });

    return { embeds: [embed] };
  } catch (error) {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("❌ Erro na Configuração")
      .setDescription(`Ocorreu um erro ao configurar o canal de logs: ${error.message}`)
      .setFooter({ text: `Tente novamente mais tarde` });

    return { embeds: [embed] };
  }
}

/**
 * Get the friendly name of the log type
 * @param {string} type
 * @returns {string}
 */
function getLogTypeName(type) {
  switch (type) {
    case "shop":
      return "Logs da Loja";
    case "economy":
      return "Logs de Economia";
    case "admin":
      return "Logs de Admin";
    default:
      return "Logs";
  }
}
