const { ApplicationCommandOptionType } = require("discord.js");
const { shopHandler } = require("@src/handlers");
const LogUtils = require("@helpers/LogUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "shopremove",
  description: "remover um produto da loja",
  category: "SHOP",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    usage: "<product_id>",
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "product_id",
        description: "ID do produto a ser removido",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async messageRun(message, args) {
    const productId = args[0];
    const response = await removeProduct(message, productId);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    const productId = interaction.options.getString("product_id");
    const response = await removeProduct(interaction, productId);
    return interaction.followUp(response);
  },
};

async function removeProduct(context, productId) {
  try {
    const product = await shopHandler.deleteProduct(context.guild.id, productId);

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

    // Create log for the shop log channel
    const admin = context.user || context.author;
    const logEmbed = LogUtils.createAdminLog({
      title: "🗑️ Produto Removido",
      description: `**${admin.tag}** removeu o produto **${product.name}** da loja`,
      moderator: admin,
      color: 0xe74c3c,
      fields: [
        {
          name: "🏷️ Nome do Produto",
          value: product.name,
          inline: true,
        },
        {
          name: "💰 Preço",
          value: `${product.price} moedas`,
          inline: true,
        },
        {
          name: "📂 Categoria",
          value: product.category || "Sem categoria",
          inline: true,
        },
        {
          name: "🆔 ID do Produto",
          value: `\`${product._id}\``,
          inline: false,
        },
        {
          name: "🕒 Data de Remoção",
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
          title: "✅ Produto Removido com Sucesso!",
          description: `**${product.name}** foi removido da loja.`,
          color: 0x00ff00,
          fields: [
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
          title: "❌ Erro ao Remover Produto",
          description: `Ocorreu um erro: ${error.message}`,
          color: 0xff0000,
          timestamp: new Date(),
        },
      ],
    };
  }
}
