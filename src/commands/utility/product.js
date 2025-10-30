const { ApplicationCommandOptionType } = require("discord.js");
const { shopHandler } = require("@src/handlers");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "produto",
  description: "pesquisar e visualizar informações de produtos pelo nome",
  category: "SHOP",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "<nome_do_produto>",
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "nome",
        description: "nome do produto a ser pesquisado",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async messageRun(message, args) {
    const searchTerm = args.join(" ");
    const response = await searchAndViewProduct(message, searchTerm);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    const searchTerm = interaction.options.getString("nome");
    const response = await searchAndViewProduct(interaction, searchTerm);
    return interaction.followUp(response);
  },
};

async function searchAndViewProduct(context, searchTerm) {
  try {
    // Search products by name
    const products = await shopHandler.searchProductsByName(context.guild.id, searchTerm);

    if (!products || products.length === 0) {
      return {
        embeds: [
          {
            title: "❌ Produtos Não Encontrados",
            description: `Não foi possível encontrar produtos com o nome "${searchTerm}".`,
            color: 0xff0000,
            timestamp: new Date(),
          },
        ],
      };
    }

    // If only one product is found, show complete details
    if (products.length === 1) {
      const product = products[0];
      const embed = shopHandler.createProductEmbed(product);
      const components = shopHandler.createProductManagementComponents(product._id);

      return {
        embeds: [embed],
        components,
      };
    }

    // If multiple products are found, show list
    const embed = {
      title: "🔍 Resultados da Pesquisa",
      description: `Encontrados ${products.length} produtos com o termo "${searchTerm}":`,
      color: 0x3498db,
      fields: [],
      footer: {
        text: "Use /product com um nome mais específico para refinar sua pesquisa.",
      },
      timestamp: new Date(),
    };

    // Add each product as a field
    products.forEach((product, index) => {
      embed.fields.push({
        name: `${index + 1}. ${product.name}`,
        value: `💰 **Preço:** ${product.price} moedas\n📦 **Estoque:** ${product.stock} unidades\n📂 **Categoria:** ${product.category}\n🆔 **ID:** \`${product._id}\``,
        inline: false,
      });
    });

    return {
      embeds: [embed],
    };
  } catch (error) {
    return {
      embeds: [
        {
          title: "❌ Erro ao Pesquisar Produtos",
          description: `Ocorreu um erro: ${error.message}`,
          color: 0xff0000,
          timestamp: new Date(),
        },
      ],
    };
  }
}

// Keep the original function for compatibility
async function viewProduct(context, productId) {
  try {
    const product = await shopHandler.getProduct(context.guild.id, productId);

    if (!product) {
      return {
        embeds: [
          {
            title: "❌ Produto Não Encontrado",
            description: "Não foi possível encontrar um produto com esse ID.",
            color: 0xff0000,
            timestamp: new Date(),
          },
        ],
      };
    }

    const embed = shopHandler.createProductEmbed(product);
    const components = shopHandler.createProductManagementComponents(product._id);

    return {
      embeds: [embed],
      components,
    };
  } catch (error) {
    return {
      embeds: [
        {
          title: "❌ Erro ao Visualizar Produto",
          description: `Ocorreu um erro: ${error.message}`,
          color: 0xff0000,
          timestamp: new Date(),
        },
      ],
    };
  }
}
