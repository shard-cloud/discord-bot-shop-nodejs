const { ApplicationCommandOptionType } = require("discord.js");
const { shopHandler } = require("@src/handlers");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "loja",
  description: "abrir a loja do servidor",
  category: "SHOP",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "[categoria]",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "categoria",
        description: "categoria de produtos para exibir",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    const category = args[0] || "all";
    const response = await openShop(message, category);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    const category = interaction.options.getString("categoria") || "all";
    const response = await openShop(interaction, category);
    return interaction.followUp(response);
  },
};

async function openShop(context, category = "all") {
  try {
    const { products, totalPages, currentPage } = await shopHandler.getProducts(context.guild.id, category);
    const categories = await shopHandler.getCategories(context.guild.id);

    const embed = shopHandler.createShopEmbed(products, currentPage, totalPages, category);
    const components = shopHandler.createShopComponents(categories, currentPage, totalPages, products, category);

    return {
      embeds: [embed],
      components,
    };
  } catch (error) {
    return {
      embeds: [
        {
          title: "❌ Erro ao Abrir Loja",
          description: `Ocorreu um erro: ${error.message}`,
          color: 0xff0000,
          timestamp: new Date(),
        },
      ],
    };
  }
}

