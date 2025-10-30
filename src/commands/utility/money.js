const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { getMemberStats } = require("@schemas/MemberStats");
const EconomyUtils = require("@helpers/EconomyUtils");
const LogUtils = require("@helpers/LogUtils");
const mongoose = require("mongoose");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "money",
  description: "gerenciar suas moedas - ver saldo ou transferir para outros",
  category: "UTILITY",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "[@usuário] | pay <@usuário> <quantidade> [motivo]",
    minArgsCount: 0,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "balance",
        description: "ver saldo de moedas",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "usuario",
            description: "usuário para ver o saldo (deixe vazio para ver o seu)",
            type: ApplicationCommandOptionType.User,
            required: false,
          },
        ],
      },
      {
        name: "pay",
        description: "transferir moedas para outro usuário",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "usuario",
            description: "usuário que receberá as moedas",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "quantidade",
            description: "quantidade de moedas a transferir",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            minValue: 1,
            maxValue: 1000000,
          },
          {
            name: "motivo",
            description: "motivo da transferência (opcional)",
            type: ApplicationCommandOptionType.String,
            required: false,
            maxLength: 200,
          },
        ],
      },
    ],
  },

  async messageRun(message, args) {
    const firstArg = args[0]?.toLowerCase();

    if (firstArg === "pay") {
      if (args.length < 3) {
        return message.safeReply("❌ Uso correto: `money pay <@usuário> <quantidade> [motivo]`");
      }

      const targetUser = message.mentions.users.first();
      const amount = parseInt(args[2]);
      const reason = args.slice(3).join(" ") || "Transferência";

      if (!targetUser) {
        return message.safeReply("❌ Você precisa mencionar um usuário válido!");
      }

      if (!amount || amount < 1) {
        return message.safeReply("❌ A quantidade deve ser um número positivo!");
      }

      return handlePayCommand(message, targetUser, amount, reason);
    } else {
      // Show balance (default behavior)
      const targetUser = message.mentions.users.first() || message.author;
      return handleBalanceCommand(message, targetUser);
    }
  },

  async interactionRun(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "pay") {
      const targetUser = interaction.options.getUser("usuario");
      const amount = interaction.options.getInteger("quantidade");
      const reason = interaction.options.getString("motivo") || "Transferência";

      return handlePayCommand(interaction, targetUser, amount, reason);
    } else if (subcommand === "balance") {
      const targetUser = interaction.options.getUser("usuario") || interaction.user;
      return handleBalanceCommand(interaction, targetUser);
    }
  },
};

async function handlePayCommand(context, targetUser, amount, reason) {
  try {
    const guildId = context.guild.id;
    const senderId = context.user?.id || context.author?.id;

    // Validation checks
    const validationError = validateTransfer(context, targetUser, senderId, amount);
    if (validationError) {
      return sendErrorResponse(context, validationError);
    }

    // Get both users' stats
    const [senderStats, receiverStats] = await Promise.all([
      getMemberStats(guildId, senderId),
      getMemberStats(guildId, targetUser.id),
    ]);

    const senderBalance = senderStats.coin || 0;
    const receiverBalance = receiverStats.coin || 0;

    // Check sender balance
    if (senderBalance < amount) {
      return sendErrorResponse(
        context,
        `❌ Saldo insuficiente! Você tem ${EconomyUtils.formatNumber(senderBalance)} moedas.`
      );
    }

    // Create confirmation embed
    const confirmationEmbed = createTransferConfirmationEmbed(
      context.user || context.author,
      targetUser,
      amount,
      reason,
      senderBalance,
      receiverBalance
    );

    const confirmationButtons = createTransferButtons(targetUser.id, amount, reason);

    const response = {
      embeds: [confirmationEmbed],
      components: [confirmationButtons],
      ephemeral: true,
    };

    return context.deferred ? await context.editReply(response) : await context.reply(response);
  } catch (error) {
    console.error("Pay command error:", error);
    return sendErrorResponse(context, `❌ Erro ao processar transferência: ${error.message}`);
  }
}

async function handleBalanceCommand(context, targetUser) {
  try {
    const guildId = context.guild.id;
    const memberStats = await getMemberStats(guildId, targetUser.id);

    const level = memberStats.level || 1;
    const xp = memberStats.xp || 0;
    const coins = memberStats.coin || 0;

    const wealthStatus = EconomyUtils.getWealthStatus(coins);
    const levelProgress = EconomyUtils.getLevelProgress(xp, level);

    const embed = EconomyUtils.createEmbed({
      title: `💰 Carteira de ${targetUser.username}`,
      description: wealthStatus.description,
      color: wealthStatus.color,
      thumbnail: targetUser.displayAvatarURL({ dynamic: true }),
      footer: {
        text: `ID: ${targetUser.id} • ${new Date().toLocaleDateString("pt-BR")}`,
        iconURL: context.guild.iconURL({ dynamic: true }),
      },
    });

    embed.addFields(
      {
        name: "💎 Moedas",
        value: `**${EconomyUtils.formatNumber(coins)}** 💰`,
        inline: true,
      },
      {
        name: "📊 Nível",
        value: `**${level}** ⭐`,
        inline: true,
      },
      {
        name: "🎯 XP",
        value: `**${EconomyUtils.formatNumber(xp)}** / ${EconomyUtils.formatNumber(levelProgress.needed)}`,
        inline: true,
      },
      {
        name: "📈 Progresso",
        value: levelProgress.bar,
        inline: false,
      },
      {
        name: "🎮 Estatísticas",
        value: `💬 **Mensagens:** ${memberStats.messages || 0}\n🎤 **Tempo de Voz:** ${Math.floor(
          (memberStats.voice?.time || 0) / 60
        )}min\n⚡ **Comandos:** ${(memberStats.commands?.prefix || 0) + (memberStats.commands?.slash || 0)}`,
        inline: false,
      }
    );

    const response = { embeds: [embed] };
    return context.deferred ? await context.editReply(response) : await context.reply(response);
  } catch (error) {
    console.error("Balance command error:", error);
    const errorResponse = {
      embeds: [EconomyUtils.createErrorEmbed("Erro ao Consultar Saldo", `Ocorreu um erro: ${error.message}`)],
    };
    return context.deferred ? await context.editReply(errorResponse) : await context.reply(errorResponse);
  }
}

function validateTransfer(context, targetUser, senderId, amount) {
  if (targetUser.id === senderId) {
    return "❌ Você não pode transferir moedas para si mesmo!";
  }

  if (targetUser.bot) {
    return "❌ Você não pode transferir moedas para bots!";
  }

  if (amount < 1 || amount > 1000000) {
    return "❌ A quantidade deve ser entre 1 e 1.000.000 moedas!";
  }

  return null;
}

async function sendErrorResponse(context, message) {
  const errorResponse = { content: message, ephemeral: true };
  return context.deferred ? await context.editReply(errorResponse) : await context.reply(errorResponse);
}

function createTransferConfirmationEmbed(sender, receiver, amount, reason, senderBalance, receiverBalance) {
  const transferStatus = EconomyUtils.getTransferStatus(amount);
  const senderFutureBalance = senderBalance - amount;
  const receiverFutureBalance = receiverBalance + amount;

  return new EmbedBuilder()
    .setColor(transferStatus.color || 0x0099ff)
    .setTitle("💸 Confirmação de Transferência")
    .setDescription(`${transferStatus.emoji} **${transferStatus.title}**\n${transferStatus.description}`)
    .addFields(
      {
        name: "👤 Remetente",
        value: `${sender.tag}`,
        inline: true,
      },
      {
        name: "👥 Destinatário",
        value: `${receiver.tag}`,
        inline: true,
      },
      {
        name: "💰 Quantidade",
        value: `**${EconomyUtils.formatNumber(amount)}** moedas`,
        inline: true,
      },
      {
        name: "🏦 Seu Saldo",
        value: `${EconomyUtils.formatNumber(senderBalance)} → ${EconomyUtils.formatNumber(senderFutureBalance)} moedas`,
        inline: false,
      },
      {
        name: "💳 Saldo do Destinatário",
        value: `${EconomyUtils.formatNumber(receiverBalance)} → ${EconomyUtils.formatNumber(
          receiverFutureBalance
        )} moedas`,
        inline: false,
      },
      {
        name: "📝 Motivo",
        value: reason,
        inline: false,
      }
    )
    .setTimestamp();
}

function createTransferButtons(targetUserId, amount, reason) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`confirm_transfer|${targetUserId}|${amount}|${encodeURIComponent(reason)}`)
      .setLabel("✅ Confirmar Transferência")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`cancel_transfer|${targetUserId}|${amount}`)
      .setLabel("❌ Cancelar")
      .setStyle(ButtonStyle.Danger)
  );
}
