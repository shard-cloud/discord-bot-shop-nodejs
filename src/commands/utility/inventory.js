const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getUserTransactions } = require("@schemas/Transaction");
const { getProduct } = require("@schemas/Product");
const EconomyUtils = require("@helpers/EconomyUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "inventario",
  description: "ver seus produtos comprados",
  category: "UTILITY",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "[@usuário] [página]",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "usuário",
        description: "usuário para ver o inventário (opcional)",
        type: ApplicationCommandOptionType.User,
        required: false,
      },
      {
        name: "página",
        description: "página para visualizar (padrão: 1)",
        type: ApplicationCommandOptionType.Number,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    const targetUser = message.mentions.users.first() || message.author;
    const page = parseInt(args[args.length - 1]) || 1;
    const response = await getInventory(message, targetUser, page);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    const targetUser = interaction.options.getUser("usuário") || interaction.user;
    const page = interaction.options.getNumber("página") || 1;
    const response = await getInventory(interaction, targetUser, page);
    return interaction.followUp(response);
  },

  // Export the getInventory function for use in handlers
  getInventory,
};

async function getInventory(context, targetUser, page = 1) {
  try {
    const transactions = await getUserTransactions(context.guild.id, targetUser.id, 50);

    if (transactions.length === 0) {
      const embed = EconomyUtils.createEmbed({
        title: "📦 Inventário Vazio",
        description: `${targetUser.username} ainda não comprou nenhum produto.`,
        thumbnail: targetUser.displayAvatarURL({ dynamic: true }),
        footer: {
          text: `Use /shop para ver produtos disponíveis!`,
          iconURL: context.guild.iconURL({ dynamic: true }),
        },
      });

      return { embeds: [embed] };
    }

    // Group transactions by product
    const productMap = new Map();

    for (const transaction of transactions) {
      if (transaction.status !== "completed") continue;

      const productId = transaction.product_id;
      if (productMap.has(productId)) {
        const existing = productMap.get(productId);
        existing.quantity += transaction.quantity;
        existing.totalSpent += transaction.total_price;
        existing.lastPurchase = transaction.created_at;
      } else {
        productMap.set(productId, {
          productId,
          quantity: transaction.quantity,
          totalSpent: transaction.total_price,
          firstPurchase: transaction.created_at,
          lastPurchase: transaction.created_at,
        });
      }
    }

    const products = Array.from(productMap.values());
    const itemsPerPage = 5;
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = products.slice(startIndex, endIndex);

    // Get product details for display
    const productDetails = [];
    for (const product of pageProducts) {
      try {
        const productInfo = await getProduct(context.guild.id, product.productId);
        if (productInfo) {
          productDetails.push({
            ...product,
            name: productInfo.name,
            description: productInfo.description,
            image: productInfo.image_url,
            category: productInfo.category,
          });
        }
      } catch (error) {
        // Product might be deleted, use fallback
        productDetails.push({
          ...product,
          name: "Produto Removido",
          description: "Este produto não está mais disponível",
          image: null,
          category: "Desconhecida",
        });
      }
    }

    const embed = EconomyUtils.createEmbed({
      title: `📦 Inventário de ${targetUser.username}`,
      thumbnail: targetUser.displayAvatarURL({ dynamic: true }),
      footer: {
        text: `Página ${page}/${totalPages} • Total: ${products.length} produtos`,
        iconURL: context.guild.iconURL({ dynamic: true }),
      },
    });

    if (productDetails.length === 0) {
      embed.setDescription("📦 Nenhum produto encontrado nesta página.");
    } else {
      let description = "";
      for (let i = 0; i < productDetails.length; i++) {
        const product = productDetails[i];
        const index = startIndex + i + 1;

        description += `**${index}.** 🛍️ **${product.name}**\n`;
        description += `┣ 📦 **Quantidade:** ${product.quantity}x\n`;
        description += `┣ 💰 **Total Gasto:** ${EconomyUtils.formatNumber(product.totalSpent)} moedas\n`;
        description += `┣ 📂 **Categoria:** ${product.category}\n`;
        description += `┣ 📅 **Última Compra:** <t:${Math.floor(product.lastPurchase.getTime() / 1000)}:R>\n`;
        if (product.description && product.description !== "Este produto não está mais disponível") {
          description += `┗ 📝 **Descrição:** ${
            product.description.length > 100 ? product.description.substring(0, 100) + "..." : product.description
          }\n\n`;
        } else {
          description += `┗ ❌ **Status:** Produto indisponível\n\n`;
        }
      }
      embed.setDescription(description);
    }

    // Add statistics
    const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalSpent = products.reduce((sum, p) => sum + p.totalSpent, 0);
    const uniqueProducts = products.length;

    // Obter conquistas
    const achievements = EconomyUtils.getAchievements({
      totalItems,
      totalSpent,
      uniqueProducts,
    });

    embed.addFields(
      {
        name: "📊 Estatísticas",
        value: `**Total de Itens:** ${EconomyUtils.formatNumber(
          totalItems
        )}\n**Produtos Únicos:** ${uniqueProducts}\n**Total Gasto:** ${EconomyUtils.formatNumber(totalSpent)} moedas`,
        inline: true,
      },
      {
        name: "🏆 Conquistas",
        value: achievements.join("\n"),
        inline: true,
      }
    );

    // Create navigation buttons if there are multiple pages
    const components = [];
    if (totalPages > 1) {
      const navButtons = [];

      navButtons.push(
        new ButtonBuilder()
          .setCustomId(`inventory_prev|${page}-${totalPages}|${targetUser.id}`)
          .setEmoji("⬅️")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 1),
        new ButtonBuilder()
          .setCustomId(`inventory_next|${page}-${totalPages}|${targetUser.id}`)
          .setEmoji("➡️")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === totalPages)
      );

      components.push(new ActionRowBuilder().addComponents(navButtons));
    }

    return { embeds: [embed], components };
  } catch (error) {
    return {
      embeds: [EconomyUtils.createErrorEmbed("Erro ao Consultar Inventário", `Ocorreu um erro: ${error.message}`)],
    };
  }
}
