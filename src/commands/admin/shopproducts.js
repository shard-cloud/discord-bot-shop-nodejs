const { ApplicationCommandOptionType } = require("discord.js");
const { shopHandler } = require("@src/handlers");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "shopproducts",
  description: "listar todos os produtos da loja",
  category: "SHOP",
  userPermissions: ["ManageGuild"],
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

  async messageRun(message, args, data) {
    const category = args[0] || "all";
    const response = await listProducts(message, category);
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const category = interaction.options.getString("categoria") || "all";
    const response = await listProducts(interaction, category);
    return interaction.followUp(response);
  },
};

async function listProducts(context, category = "all") {
  try {
    const { products } = await shopHandler.getProducts(context.guild.id, category);

    if (products.length === 0) {
      return {
        embeds: [
          {
            title: "📦 Produtos da Loja",
            description: `Nenhum produto encontrado${category !== "all" ? ` na categoria "${category}"` : ""}.`,
            color: 0x0099ff,
            timestamp: new Date(),
          },
        ],
      };
    }

    const embed = {
      title: "📦 Produtos da Loja",
      description: `Exibindo ${products.length} produto(s)${category !== "all" ? ` da categoria "${category}"` : ""}:`,
      color: 0x0099ff,
      fields: [],
      timestamp: new Date(),
    };

    for (const product of products) {
      const stockStatus = product.stock > 0 ? `✅ ${product.stock} em estoque` : "❌ Sem estoque";
      const status = product.is_active ? "🟢 Ativo" : "🔴 Inativo";

      embed.fields.push({
        name: `🛍️ ${product.name}`,
        value: `**Descrição:** ${product.description}\n**Preço:** 💰 ${product.price} moedas\n**Estoque:** ${stockStatus}\n**Categoria:** ${product.category}\n**Status:** ${status}\n**ID:** \`${product._id}\``,
        inline: false,
      });
    }

    return { embeds: [embed] };
  } catch (error) {
    return {
      embeds: [
        {
          title: "❌ Erro ao Listar Produtos",
          description: `Ocorreu um erro: ${error.message}`,
          color: 0xff0000,
          timestamp: new Date(),
        },
      ],
    };
  }
}
