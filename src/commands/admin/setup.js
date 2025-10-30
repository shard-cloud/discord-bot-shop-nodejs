const { ApplicationCommandOptionType, PermissionFlagsBits, ChannelType, EmbedBuilder } = require("discord.js");
const { getSettings } = require("@schemas/Guild");
const LogUtils = require("@helpers/LogUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "setup",
  description: "configurar o bot para o servidor",
  category: "ADMIN",
  userPermissions: ["Administrator"],
  botPermissions: ["ManageChannels", "EmbedLinks"],
  command: {
    enabled: true,
    usage: "[confirm]",
  },
  slashCommand: {
    enabled: true,
    display: true,
    options: [
      {
        name: "tipo",
        description: "tipo de configuração",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          {
            name: "Automático - Criar todos os canais",
            value: "auto",
          },
          {
            name: "Manual - Apenas configurar canais existentes",
            value: "manual",
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const type = args[0]?.toLowerCase() === "manual" ? "manual" : "auto";
    const response = await setupServer(message, type, message.author);
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const type = interaction.options.getString("tipo");
    const response = await setupServer(interaction, type, interaction.user);
    return interaction.followUp(response);
  },
};

/**
 * @param {import('discord.js').CommandInteraction|import('discord.js').Message} context
 * @param {string} type
 * @param {import('discord.js').User} user
 */
async function setupServer(context, type, user) {
  try {
    const guild = context.guild;
    const settings = await getSettings(guild);

    // Check if the setup has already been completed
    if (settings.setup?.completed) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("⚠️ Setup já concluído")
        .setDescription(
          `O setup já foi concluído neste servidor por <@${settings.setup.completed_by}> em <t:${Math.floor(
            settings.setup.completed_at.getTime() / 1000
          )}:F>.\n\nPara reconfigurar, use o comando \`/setlogchannel\` para alterar canais específicos.`
        )
        .setFooter({ text: `Solicitado por ${user.tag}`, iconURL: user.displayAvatarURL() });

      return { embeds: [embed] };
    }

    // Create category and channels if for automatic setup
    if (type === "auto") {
      try {
        // Create logs category
        const logsCategory = await guild.channels.create({
          name: "📊 Logs do Bot",
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: guild.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: guild.members.me.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.EmbedLinks,
              ],
            },
          ],
        });

        // Create log channels
        const shopLogChannel = await guild.channels.create({
          name: "🛒-logs-loja",
          type: ChannelType.GuildText,
          parent: logsCategory.id,
          topic: "Logs de compras e atividades da loja",
        });

        const economyLogChannel = await guild.channels.create({
          name: "💰-logs-economia",
          type: ChannelType.GuildText,
          parent: logsCategory.id,
          topic: "Logs de transações de moedas e economia",
        });

        const adminLogChannel = await guild.channels.create({
          name: "⚙️-logs-admin",
          type: ChannelType.GuildText,
          parent: logsCategory.id,
          topic: "Logs de comandos administrativos",
        });

        // Update settings
        settings.logs = {
          shop: shopLogChannel.id,
          economy: economyLogChannel.id,
          admin: adminLogChannel.id,
          enabled: true,
        };

        settings.setup = {
          completed: true,
          completed_at: new Date(),
          completed_by: user.id,
        };

        await settings.save();

        // Create log embed for the setup
        const logEmbed = LogUtils.createAdminLog({
          title: "⚙️ Setup do Servidor Concluído",
          description: `**${user.tag}** configurou o bot no servidor **${context.guild.name}**`,
          moderator: user,
          color: 0x2ecc71,
          fields: [
            {
              name: "📊 Canais Criados",
              value:
                `🛒 **Logs da Loja:** <#${shopLogChannel.id}>\n` +
                `💰 **Logs de Economia:** <#${economyLogChannel.id}>\n` +
                `⚙️ **Logs de Admin:** <#${adminLogChannel.id}>`,
              inline: false,
            },
            {
              name: "🕒 Data",
              value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
              inline: true,
            },
          ],
        });

        // Send log to the admin channel
        try {
          await adminLogChannel.send({ embeds: [logEmbed] });
        } catch (logError) {
          console.error("Erro ao enviar log de setup:", logError);
        }

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("✅ Setup Concluído!")
          .setDescription(
            `O setup foi concluído com sucesso! Os seguintes canais foram criados:\n\n` +
              `📊 **Categoria:** ${logsCategory.name}\n` +
              `🛒 **Logs da Loja:** <#${shopLogChannel.id}>\n` +
              `💰 **Logs de Economia:** <#${economyLogChannel.id}>\n` +
              `⚙️ **Logs de Admin:** <#${adminLogChannel.id}>\n\n` +
              `Você pode alterar essas configurações a qualquer momento usando o comando \`/setlogchannel\`.`
          )
          .setFooter({ text: `Configurado por ${user.tag}`, iconURL: user.displayAvatarURL() })
          .setTimestamp();

        return { embeds: [embed] };
      } catch (err) {
        // Check if the error is related to 2FA
        if (err.code === 50035 || err.message.includes("Two factor")) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("❌ Erro no Setup: Autenticação de Dois Fatores Necessária")
            .setDescription(
              "Este servidor tem a **Autenticação de Dois Fatores (2FA)** ativada para ações administrativas.\n\n" +
                "**Por que isso acontece?**\n" +
                "O Discord exige que bots também tenham 2FA quando o servidor tem essa configuração ativada.\n\n" +
                "**Como resolver:**\n" +
                "1. Use o setup manual: `/setup tipo:manual`\n" +
                "2. Crie manualmente os canais necessários\n" +
                "3. Configure cada canal usando `/setlogchannel`\n\n" +
                "Ou desative temporariamente a verificação em duas etapas nas configurações do servidor (Servidor > Configurações > Segurança)."
            )
            .setFooter({ text: `Solicitado por ${user.tag}`, iconURL: user.displayAvatarURL() });

          return { embeds: [embed] };
        }

        // Other errors
        throw err;
      }
    } else {
      // Setup manual - show instructions
      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("🔧 Setup Manual")
        .setDescription(
          `Para configurar manualmente os canais de log, use os seguintes comandos:\n\n` +
            `• \`/setlogchannel tipo:loja #canal\` - Configurar canal de logs da loja\n` +
            `• \`/setlogchannel tipo:economia #canal\` - Configurar canal de logs de economia\n` +
            `• \`/setlogchannel tipo:admin #canal\` - Configurar canal de logs administrativos\n\n` +
            `Após configurar todos os canais necessários, o sistema de logs será ativado automaticamente.`
        )
        .setFooter({ text: `Solicitado por ${user.tag}`, iconURL: user.displayAvatarURL() });

      return { embeds: [embed] };
    }
  } catch (error) {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("❌ Erro no Setup")
      .setDescription(`Ocorreu um erro durante o setup: ${error.message}`)
      .setFooter({ text: `Tente novamente ou use o setup manual` });

    return { embeds: [embed] };
  }
}
