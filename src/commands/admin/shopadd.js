const { ApplicationCommandOptionType, ChannelType } = require("discord.js");
const { shopHandler } = require("@src/handlers");
const LogUtils = require("@helpers/LogUtils");
const { parseQuotedArgs } = require("@helpers/Utils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "shopadd",
  description: "adicionar um novo produto à loja",
  category: "SHOP",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    usage: "<nome> <preço> <estoque> <descrição> [categoria] [imagem]",
    minArgsCount: 4,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "nome",
        description: "nome do produto",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "preco",
        description: "preço do produto em moedas",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: "estoque",
        description: "quantidade em estoque",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: "descricao",
        description: "descrição do produto",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "categoria",
        description: "categoria do produto",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
      {
        name: "imagem",
        description: "URL da imagem do produto",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
      {
        name: "anexo",
        description: "imagem do produto (anexo)",
        type: ApplicationCommandOptionType.Attachment,
        required: false,
      },
    ],
  },

  async messageRun(message, args, data) {
    // Analyze arguments with support for quotes
    const fullContent = message.content.trim();
    const commandPart = fullContent.split(" ")[0]; // Pegar o comando (!shopadd)
    const argsString = fullContent.substring(commandPart.length).trim();
    const quotedArgs = parseQuotedArgs(argsString);

    // Check if we have enough arguments
    if (quotedArgs.length < 4) {
      return message.safeReply(
        '❌ Uso incorreto! Use: `!shopadd "Nome do Produto" preço estoque "Descrição do produto" "Categoria (opcional)" URL_da_imagem(opcional)`'
      );
    }

    // Extract arguments
    const name = quotedArgs[0];
    const price = parseFloat(quotedArgs[1]);
    const stock = parseInt(quotedArgs[2]);
    const description = quotedArgs[3];

    // Determine category (optional)
    let category = "Geral";
    if (quotedArgs.length > 4) {
      category = quotedArgs[4];
    }

    // Check if there is an attached image
    let imageUrl = null;
    if (message.attachments.size > 0) {
      const attachment = message.attachments.first();
      // Check if the attachment is an image
      if (attachment.contentType && attachment.contentType.startsWith("image/")) {
        imageUrl = attachment.url;
      }
    }

    // If there is no attachment, try to use the last argument as image URL
    if (!imageUrl && quotedArgs.length > 5) {
      const lastArg = quotedArgs[quotedArgs.length - 1];
      if (
        lastArg.startsWith("http") &&
        (lastArg.endsWith(".png") ||
          lastArg.endsWith(".jpg") ||
          lastArg.endsWith(".jpeg") ||
          lastArg.endsWith(".gif") ||
          lastArg.endsWith(".webp"))
      ) {
        imageUrl = lastArg;
      }
    }

    if (isNaN(price) || price < 0) {
      return message.safeReply("❌ Preço inválido! O preço deve ser um número positivo.");
    }

    if (isNaN(stock) || stock < 0) {
      return message.safeReply("❌ Estoque inválido! O estoque deve ser um número positivo.");
    }

    const response = await addProduct(message, {
      name,
      price,
      stock,
      description,
      category,
      imageUrl,
      guildId: message.guild.id,
      createdBy: message.author.id,
    });

    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const name = interaction.options.getString("nome");
    const price = interaction.options.getNumber("preco");
    const stock = interaction.options.getNumber("estoque");
    const description = interaction.options.getString("descricao");
    const category = interaction.options.getString("categoria") || "Geral";

    // Check if there is an attachment or an image URL
    let imageUrl = interaction.options.getString("imagem");
    const attachment = interaction.options.getAttachment("anexo");

    // Prioritize the attachment if available
    if (attachment && attachment.contentType && attachment.contentType.startsWith("image/")) {
      imageUrl = attachment.url;
    }

    if (price < 0) {
      return interaction.followUp("❌ Preço inválido! O preço deve ser um número positivo.");
    }

    if (stock < 0) {
      return interaction.followUp("❌ Estoque inválido! O estoque deve ser um número positivo.");
    }

    const response = await addProduct(interaction, {
      name,
      price,
      stock,
      description,
      category,
      imageUrl,
      guildId: interaction.guild.id,
      createdBy: interaction.user.id,
    });

    return interaction.followUp(response);
  },
};

async function addProduct(context, productData) {
  try {
    const product = await shopHandler.createProduct(productData);

    const embed = {
      title: "✅ Produto Adicionado com Sucesso!",
      description: `**${product.name}** foi adicionado à loja.`,
      color: 0x00ff00,
      fields: [
        {
          name: "💰 Preço",
          value: `${product.price} moedas`,
          inline: true,
        },
        {
          name: "📦 Estoque",
          value: `${product.stock} unidades`,
          inline: true,
        },
        {
          name: "📂 Categoria",
          value: product.category,
          inline: true,
        },
        {
          name: "🆔 ID do Produto",
          value: `\`${product._id}\``,
          inline: false,
        },
      ],
      timestamp: new Date(),
    };

    if (product.image_url) {
      embed.image = { url: product.image_url };
    }

    // Create log for the shop log channel
    const admin = context.user || context.author;
    const logEmbed = LogUtils.createAdminLog({
      title: "🛍️ Novo Produto Adicionado",
      description: `**${admin.tag}** adicionou o produto **${product.name}** à loja`,
      moderator: admin,
      color: 0x2ecc71,
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
          name: "📦 Estoque",
          value: `${product.stock} unidades`,
          inline: true,
        },
        {
          name: "📂 Categoria",
          value: product.category,
          inline: true,
        },
        {
          name: "📝 Descrição",
          value: product.description || "Sem descrição",
          inline: false,
        },
        {
          name: "🆔 ID do Produto",
          value: `\`${product._id}\``,
          inline: false,
        },
        {
          name: "🕒 Data de Criação",
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

    return { embeds: [embed] };
  } catch (error) {
    return {
      embeds: [
        {
          title: "❌ Erro ao Adicionar Produto",
          description: `Ocorreu um erro: ${error.message}`,
          color: 0xff0000,
          timestamp: new Date(),
        },
      ],
    };
  }
}
