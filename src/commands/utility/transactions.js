const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { shopHandler } = require("@src/handlers");
const EconomyUtils = require("@helpers/EconomyUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "compras",
  description: "visualizar suas transações de compra",
  category: "SHOP",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "[página]",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "página",
        description: "página para visualizar (padrão: 1)",
        type: ApplicationCommandOptionType.Integer,
        required: false,
        minValue: 1,
        maxValue: 100,
      },
    ],
  },

  async messageRun(message, args) {
    const page = parseInt(args[0]) || 1;
    const response = await viewTransactions(message, message.author.id, page);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    const page = interaction.options.getInteger("página") || 1;
    const response = await viewTransactions(interaction, interaction.user.id, page);
    return interaction.followUp(response);
  },

  // Export function for handlers
  viewTransactions,
};

async function viewTransactions(context, userId, page = 1) {
  try {
    const transactions = await shopHandler.getUserTransactions(context.guild.id, userId);
    const user = context.user || context.author;

    if (!transactions || transactions.length === 0) {
      return {
        embeds: [
          EconomyUtils.createEmbed({
            title: "📋 Nenhuma Transação Encontrada",
            description: "Você ainda não realizou nenhuma compra.",
            thumbnail: user.displayAvatarURL({ dynamic: true }),
            footer: {
              text: "Use /loja para ver produtos disponíveis!",
              iconURL: context.guild.iconURL({ dynamic: true }),
            },
          }),
        ],
      };
    }

    // Pagination logic
    const itemsPerPage = 5;
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageTransactions = transactions.slice(startIndex, endIndex);

    const embed = EconomyUtils.createEmbed({
      title: `📋 Transações de ${user.username}`,
      thumbnail: user.displayAvatarURL({ dynamic: true }),
      footer: {
        text: `Página ${page} de ${totalPages} • Total: ${transactions.length} transações`,
        iconURL: context.guild.iconURL({ dynamic: true }),
      },
    });

    const statusEmoji = {
      pending: "⏳",
      completed: "✅",
      cancelled: "❌",
      refunded: "🔄",
    };

    let description = "";
    for (let i = 0; i < pageTransactions.length; i++) {
      const transaction = pageTransactions[i];
      const timestamp = Math.floor(transaction.created_at.getTime() / 1000);
      const status = statusEmoji[transaction.status] || "❓";
      const index = startIndex + i + 1;

      description += `**${index}.** ${status} **${transaction.product_name || "Produto Removido"}**\n`;
      description += `┣ 💰 **Valor:** ${EconomyUtils.formatNumber(transaction.total_price)} moedas\n`;
      description += `┣ 📦 **Quantidade:** ${transaction.quantity}x\n`;
      description += `┣ 📅 **Data:** <t:${timestamp}:f>\n`;
      description += `┗ 🆔 **ID:** \`${transaction._id}\`\n\n`;
    }

    embed.setDescription(description);

    // Add navigation buttons
    const components = [];
    if (totalPages > 1) {
      const navButtons = [];

      navButtons.push(
        new ButtonBuilder()
          .setCustomId(`transactions_prev|${page}-${totalPages}|${userId}`)
          .setEmoji("⬅️")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 1),
        new ButtonBuilder()
          .setCustomId(`transactions_next|${page}-${totalPages}|${userId}`)
          .setEmoji("➡️")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === totalPages)
      );

      components.push(new ActionRowBuilder().addComponents(navButtons));
    }

    return { embeds: [embed], components };
  } catch (error) {
    return {
      embeds: [EconomyUtils.createErrorEmbed("Erro ao Consultar Transações", `Ocorreu um erro: ${error.message}`)],
    };
  }
}
