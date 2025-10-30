const { ApplicationCommandOptionType } = require("discord.js");
const { shopHandler } = require("@src/handlers");
const LogUtils = require("@helpers/LogUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "shopedit",
  description: "editar um produto da loja",
  category: "SHOP",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    usage: "<product_id> <campo> <novo_valor>",
    minArgsCount: 3,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "product_id",
        description: "ID do produto a ser editado",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "campo",
        description: "campo a ser editado",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: "Nome", value: "name" },
          { name: "Preço", value: "price" },
          { name: "Estoque", value: "stock" },
          { name: "Descrição", value: "description" },
          { name: "Categoria", value: "category" },
          { name: "Imagem", value: "image_url" },
        ],
      },
      {
        name: "novo_valor",
        description: "novo valor para o campo",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async messageRun(message, args) {
    const productId = args[0];
    const field = args[1];
    const newValue = args.slice(2).join(" ");

    const response = await editProduct(message, productId, field, newValue);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    const productId = interaction.options.getString("product_id");
    const field = interaction.options.getString("campo");
    const newValue = interaction.options.getString("novo_valor");

    const response = await editProduct(interaction, productId, field, newValue);
    return interaction.followUp(response);
  },
};

async function editProduct(context, productId, field, newValue) {
  try {
    // Validate fields
    const allowedFields = ["name", "price", "stock", "description", "category", "image_url"];
    if (!allowedFields.includes(field)) {
      return {
        embeds: [
          {
            title: "❌ Campo Inválido",
            description: `Campos permitidos: ${allowedFields.join(", ")}`,
            color: 0xff0000,
            timestamp: new Date(),
          },
        ],
      };
    }

    // Validate numeric fields (price and stock)
    if (field === "price" || field === "stock") {
      const numValue = parseFloat(newValue);
      if (isNaN(numValue) || numValue < 0) {
        return {
          embeds: [
            {
              title: "❌ Valor Inválido",
              description: "O preço e estoque devem ser números positivos.",
              color: 0xff0000,
              timestamp: new Date(),
            },
          ],
        };
      }
    }

    // Prepare update data (for price and stock)
    const updateData = { [field]: newValue };
    if (field === "price" || field === "stock") {
      updateData[field] = parseFloat(newValue);
    }

    const product = await shopHandler.updateProduct(context.guild.id, productId, updateData);

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

    const fieldNames = {
      name: "Nome",
      price: "Preço",
      stock: "Estoque",
      description: "Descrição",
      category: "Categoria",
      image_url: "Imagem",
    };

    // Create log for the shop log channel
    const admin = context.user || context.author;
    const oldValue =
      field === "image_url" ? "URL anterior" : product[field] !== newValue ? product[field] : "Valor anterior";

    const logEmbed = LogUtils.createAdminLog({
      title: "✏️ Produto Editado",
      description: `**${admin.tag}** editou o produto **${product.name}**`,
      moderator: admin,
      color: 0x3498db,
      fields: [
        {
          name: "🏷️ Nome do Produto",
          value: product.name,
          inline: true,
        },
        {
          name: "📝 Campo Editado",
          value: fieldNames[field],
          inline: true,
        },
        {
          name: "⬅️ Valor Anterior",
          value: `${oldValue}`,
          inline: true,
        },
        {
          name: "➡️ Novo Valor",
          value: `${newValue}`,
          inline: true,
        },
        {
          name: "🆔 ID do Produto",
          value: `\`${product._id}\``,
          inline: false,
        },
        {
          name: "🕒 Data da Edição",
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: false,
        },
      ],
    });

    // If the edited field is the image, show the new image
    if (field === "image_url" && newValue) {
      logEmbed.setImage(newValue);
    }

    // Send log
    LogUtils.sendLog(context.guild, "shop", logEmbed).catch(() => {});

    return {
      embeds: [
        {
          title: "✅ Produto Editado com Sucesso!",
          description: `**${fieldNames[field]}** do produto foi atualizado.`,
          color: 0x00ff00,
          fields: [
            {
              name: "🛍️ Produto",
              value: product.name,
              inline: true,
            },
            {
              name: "📝 Campo Editado",
              value: fieldNames[field],
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
          title: "❌ Erro ao Editar Produto",
          description: `Ocorreu um erro: ${error.message}`,
          color: 0xff0000,
          timestamp: new Date(),
        },
      ],
    };
  }
}
