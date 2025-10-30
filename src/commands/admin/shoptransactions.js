const { ApplicationCommandOptionType } = require("discord.js");
const { shopHandler } = require("@src/handlers");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "shoptransactions",
  description: "visualizar todas as transações da loja",
  category: "SHOP",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    usage: "[limite]",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "limite",
        description: "número máximo de transações para exibir",
        type: ApplicationCommandOptionType.Number,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    const limit = parseInt(args[0]) || 20;
    const response = await viewAllTransactions(message, limit);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    const limit = interaction.options.getNumber("limite") || 20;
    const response = await viewAllTransactions(interaction, limit);
    return interaction.followUp(response);
  },
};

async function viewAllTransactions(context, limit = 20) {
  try {
    const transactions = await shopHandler.getGuildTransactions(context.guild.id);

    if (transactions.length === 0) {
      return {
        embeds: [
          {
            title: "📋 Transações da Loja",
            description: "Nenhuma transação foi encontrada.",
            color: 0x0099ff,
            timestamp: new Date(),
          },
        ],
      };
    }

    const embed = {
      title: "📋 Transações da Loja",
      description: `Exibindo as últimas ${Math.min(limit, transactions.length)} transações:`,
      color: 0x0099ff,
      fields: [],
      timestamp: new Date(),
    };

    const limitedTransactions = transactions.slice(0, limit);

    for (const transaction of limitedTransactions) {
      const statusEmoji = {
        pending: "⏳",
        completed: "✅",
        cancelled: "❌",
        refunded: "🔄",
      };

      // Try to get user information
      let buyerTag = "Usuário Desconhecido";
      try {
        const buyer = await context.client.users.fetch(transaction.buyer_id);
        buyerTag = buyer.tag;
      } catch (error) {
        // User not found, keep default value
      }

      embed.fields.push({
        name: `${statusEmoji[transaction.status]} Transação ${transaction._id}`,
        value: `**Comprador:** ${buyerTag}\n**Produto:** ${transaction.product_id}\n**Quantidade:** ${
          transaction.quantity
        }\n**Total:** ${transaction.total_price} moedas\n**Data:** <t:${Math.floor(
          transaction.created_at.getTime() / 1000
        )}:R>`,
        inline: false,
      });
    }

    return { embeds: [embed] };
  } catch (error) {
    return {
      embeds: [
        {
          title: "❌ Erro ao Visualizar Transações",
          description: `Ocorreu um erro: ${error.message}`,
          color: 0xff0000,
          timestamp: new Date(),
        },
      ],
    };
  }
}
