const { ApplicationCommandOptionType } = require("discord.js");
const { getMemberStats } = require("@schemas/MemberStats");
const EconomyUtils = require("@helpers/EconomyUtils");
const LogUtils = require("@helpers/LogUtils");
const mongoose = require("mongoose");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "give",
  description: "dar moedas para um usuário",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "<@usuário> <quantidade> [motivo]",
    minArgsCount: 2,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "usuário",
        description: "usuário para dar moedas",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "quantidade",
        description: "quantidade de moedas para dar",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: "motivo",
        description: "motivo para dar as moedas (opcional)",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async messageRun(message, args, data) {
    const targetUser = message.mentions.users.first();
    const amount = parseInt(args[1]);
    const reason = args.slice(2).join(" ") || "Sem motivo especificado";

    if (!targetUser) {
      return message.safeReply("❌ Por favor, mencione um usuário válido.");
    }

    // Validar transferência
    const validation = EconomyUtils.validateTransfer(amount);
    if (!validation.valid) {
      return message.safeReply(`❌ ${validation.error}`);
    }

    const response = await giveCoins(message, targetUser, amount, reason);
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const targetUser = interaction.options.getUser("usuário");
    const amount = interaction.options.getNumber("quantidade");
    const reason = interaction.options.getString("motivo") || "Sem motivo especificado";

    // Validar transferência
    const validation = EconomyUtils.validateTransfer(amount);
    if (!validation.valid) {
      return interaction.followUp(`❌ ${validation.error}`);
    }

    const response = await giveCoins(interaction, targetUser, amount, reason);
    return interaction.followUp(response);
  },
};

async function giveCoins(context, targetUser, amount, reason) {
  try {
    // Get current balance
    const memberStats = await getMemberStats(context.guild.id, targetUser.id);
    const oldBalance = memberStats.coin || 0;

    // Add coins directly to the MongoDB
    const MemberStatsModel = mongoose.model("member-stats");

    // First we save the document to ensure it exists
    await memberStats.save();

    // Then we update with the new balance
    await MemberStatsModel.updateOne(
      { guild_id: context.guild.id, member_id: targetUser.id },
      { $inc: { coin: amount } }
    );

    // Get new balance
    const newMemberStats = await getMemberStats(context.guild.id, targetUser.id, true);
    const newBalance = newMemberStats.coin;

    // Get transfer status
    const transferStatus = EconomyUtils.getTransferStatus(amount);

    // Create embed
    const embed = EconomyUtils.createEmbed({
      title: "💰 Moedas Transferidas!",
      description: transferStatus.description,
      color: transferStatus.color,
      thumbnail: targetUser.displayAvatarURL({ dynamic: true }),
      footer: {
        text: `Servidor: ${context.guild.name} • ${new Date().toLocaleDateString("pt-BR")}`,
        iconURL: context.guild.iconURL({ dynamic: true }),
      },
    });

    // Add fields
    embed.addFields(
      {
        name: "👤 Usuário",
        value: `${targetUser.tag} (${targetUser.id})`,
        inline: true,
      },
      {
        name: "💎 Quantidade",
        value: `**+${EconomyUtils.formatNumber(amount)}** moedas`,
        inline: true,
      },
      {
        name: "📊 Saldo Anterior",
        value: `**${EconomyUtils.formatNumber(oldBalance)}** moedas`,
        inline: true,
      },
      {
        name: "💰 Novo Saldo",
        value: `**${EconomyUtils.formatNumber(newBalance)}** moedas`,
        inline: true,
      },
      {
        name: "📝 Motivo",
        value: reason,
        inline: false,
      },
      {
        name: "👮 Administrador",
        value: `${context.user?.tag || context.author?.tag || "Administrador"}`,
        inline: true,
      }
    );

    // Send log to the economy log channel
    const admin = context.user || context.author;
    const logEmbed = LogUtils.createEconomyLog({
      title: "💰 Moedas Adicionadas",
      description: `**${admin.tag}** adicionou **${EconomyUtils.formatNumber(amount)}** moedas para **${
        targetUser.tag
      }**`,
      user: targetUser,
      moderator: admin,
      color: 0x2ecc71,
      fields: [
        {
          name: "💎 Quantidade",
          value: `**+${EconomyUtils.formatNumber(amount)}** moedas`,
          inline: true,
        },
        {
          name: "💰 Novo Saldo",
          value: `**${EconomyUtils.formatNumber(newBalance)}** moedas`,
          inline: true,
        },
        {
          name: "📝 Motivo",
          value: reason,
          inline: false,
        },
      ],
    });

    // Try to send the log
    LogUtils.sendLog(context.guild, "economy", logEmbed).catch(() => {});

    return { embeds: [embed] };
  } catch (error) {
    return {
      embeds: [EconomyUtils.createErrorEmbed("Erro ao Transferir Moedas", `Ocorreu um erro: ${error.message}`)],
    };
  }
}
