const { ApplicationCommandOptionType } = require("discord.js");
const { shopHandler } = require("@src/handlers");
const LogUtils = require("@helpers/LogUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "shopstock",
  description: "gerenciar estoque de produtos da loja",
  category: "SHOP",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    usage: "<product_id> <quantidade>",
    minArgsCount: 2,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "product_id",
        description: "ID do produto",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "quantidade",
        description: "quantidade a adicionar/remover (use + para adicionar, - para remover)",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async messageRun(message, args) {
    const productId = args[0];
    const quantity = args[1];

    const response = await updateStock(message, productId, quantity);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    const productId = interaction.options.getString("product_id");
    const quantity = interaction.options.getString("quantidade");

    const response = await updateStock(interaction, productId, quantity);
    return interaction.followUp(response);
  },
};

async function updateStock(context, productId, quantityStr) {
  try {
    // Parse quantity (support for + and - prefixes)
    let quantity = parseInt(quantityStr);
    if (isNaN(quantity)) {
      return {
        embeds: [
          {
            title: "❌ Quantidade Inválida",
            description: "A quantidade deve ser um número válido.",
            color: 0xff0000,
            timestamp: new Date(),
          },
        ],
      };
    }

    const product = await shopHandler.updateStock(context.guild.id, productId, quantity);

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

    const action = quantity > 0 ? "adicionado" : "removido";
    const quantityText = Math.abs(quantity);

    // Create log for the shop log channel
    const admin = context.user || context.author;
    const oldStock = product.stock - quantity;

    const logEmbed = LogUtils.createAdminLog({
      title: quantity > 0 ? "📦 Estoque Adicionado" : "📉 Estoque Removido",
      description: `**${admin.tag}** ${
        quantity > 0 ? "adicionou" : "removeu"
      } **${quantityText}** unidades do estoque de **${product.name}**`,
      moderator: admin,
      color: quantity > 0 ? 0x2ecc71 : 0xe74c3c,
      fields: [
        {
          name: "🏷️ Nome do Produto",
          value: product.name,
          inline: true,
        },
        {
          name: "⬅️ Estoque Anterior",
          value: `${oldStock} unidades`,
          inline: true,
        },
        {
          name: "➡️ Novo Estoque",
          value: `${product.stock} unidades`,
          inline: true,
        },
        {
          name: "📊 Alteração",
          value: `${quantity > 0 ? "+" : ""}${quantity} unidades`,
          inline: true,
        },
        {
          name: "🆔 ID do Produto",
          value: `\`${product._id}\``,
          inline: false,
        },
        {
          name: "🕒 Data da Alteração",
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: false,
        },
      ],
    });

    // Add product image if available
    if (product.image_url) {
      logEmbed.setImage(product.image_url);
    }

    // Send log
    LogUtils.sendLog(context.guild, "shop", logEmbed).catch(() => {});

    return {
      embeds: [
        {
          title: "✅ Estoque Atualizado!",
          description: `**${quantityText}** unidades ${action} ao estoque.`,
          color: 0x00ff00,
          fields: [
            {
              name: "🛍️ Produto",
              value: product.name,
              inline: true,
            },
            {
              name: "📦 Novo Estoque",
              value: `${product.stock} unidades`,
              inline: true,
            },
            {
              name: "🆔 ID do Produto",
              value: `\`${product._id}\``,
              inline: false,
            },
          ],
          timestamp: new Date(),
        },
      ],
    };
  } catch (error) {
    return {
      embeds: [
        {
          title: "❌ Erro ao Atualizar Estoque",
          description: `Ocorreu um erro: ${error.message}`,
          color: 0xff0000,
          timestamp: new Date(),
        },
      ],
    };
  }
}
