const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { shopHandler } = require("@src/handlers");
const Product = require("@schemas/Product");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "comprar",
  description: "comprar um produto da loja",
  category: "SHOP",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "<produto> [quantidade]",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "produto",
        description: "nome ou ID do produto",
        type: ApplicationCommandOptionType.String,
        required: true,
        autocomplete: true,
      },
      {
        name: "quantidade",
        description: "quantidade a comprar (padrão: 1)",
        type: ApplicationCommandOptionType.Integer,
        required: false,
        minValue: 1,
        maxValue: 50,
      },
    ],
  },

  async messageRun(message, args) {
    if (!args[0]) {
      return message.safeReply("❌ Você precisa especificar o produto que deseja comprar!");
    }

    // Parse product name and quantity - quantity is always the last argument if it's a number
    const lastArg = args[args.length - 1];
    const isLastArgQuantity = !isNaN(parseInt(lastArg)) && parseInt(lastArg) > 0;

    let productName;
    let quantity;

    if (isLastArgQuantity && args.length > 1) {
      // Last argument is quantity, everything else is product name
      productName = args.slice(0, -1).join(" ");
      quantity = parseInt(lastArg);
    } else {
      // No quantity specified, entire args is product name
      productName = args.join(" ");
      quantity = 1;
    }

    if (quantity < 1 || quantity > 50) {
      return message.safeReply("❌ A quantidade deve ser entre 1 e 50!");
    }

    return handleBuyCommand(message, productName, quantity);
  },

  async interactionRun(interaction, data) {
    const productName = interaction.options.getString("produto");
    const quantity = interaction.options.getInteger("quantidade") || 1;

    return handleBuyCommand(interaction, productName, quantity);
  },

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const guildId = interaction.guild.id;

    try {
      const allProducts = await shopHandler.getAllProductsForGuild(guildId);

      if (!allProducts || !Array.isArray(allProducts)) {
        await interaction.respond([]);
        return;
      }

      if (allProducts.length === 0) {
        await interaction.respond([
          {
            name: "Nenhum produto cadastrado na loja",
            value: "no_products",
          },
        ]);
        return;
      }

      const filtered = allProducts
        .filter((product) => isValidProductForAutocomplete(product, focusedValue))
        .slice(0, 25) // Discord limit
        .map((product) => formatProductOption(product));

      if (filtered.length === 0) {
        await interaction.respond([
          {
            name: "Nenhum produto encontrado",
            value: "no_match",
          },
        ]);
        return;
      }

      await interaction.respond(filtered);
    } catch (error) {
      console.error("Autocomplete error:", error);
      await interaction.respond([]);
    }
  },
};

/**
 * Check if product is valid for autocomplete suggestions
 * @param {Object} product
 * @param {string} searchValue
 * @returns {boolean}
 */
function isValidProductForAutocomplete(product, searchValue) {
  if (!product?.name || !product?._id) return false;
  if (product.is_active === false) return false;

  const search = searchValue.toLowerCase();
  return product.name.toLowerCase().includes(search) || product._id.toLowerCase().includes(search);
}

/**
 * Format product for autocomplete option
 * @param {Object} product
 * @returns {Object}
 */
function formatProductOption(product) {
  return {
    name: `${product.name} (${product.price} moedas - ${product.stock} estoque)`,
    value: product._id,
  };
}

/**
 * Validate purchase requirements
 * @param {Object} product
 * @param {number} quantity
 * @returns {string|null} Error message or null if valid
 */
function validatePurchase(product, quantity) {
  if (!product) {
    return "❌ Produto não encontrado! Use o nome completo ou ID do produto.";
  }

  if (!product.is_active) {
    return "❌ Este produto não está disponível para compra.";
  }

  if (product.stock < quantity) {
    return `❌ Estoque insuficiente! Disponível: ${product.stock} unidades.`;
  }

  return null;
}

/**
 * Send error response handling deferred state
 * @param {Object} context
 * @param {string} message
 */
async function sendErrorResponse(context, message) {
  const errorMsg = { content: message, ephemeral: true };
  return context.deferred ? await context.editReply(errorMsg) : await context.reply(errorMsg);
}

async function handleBuyCommand(context, productIdentifier, quantity) {
  try {
    const guildId = context.guild.id;
    const userId = context.user?.id || context.author?.id;

    const product = await findProduct(guildId, productIdentifier);

    const validationError = validatePurchase(product, quantity);
    if (validationError) {
      return sendErrorResponse(context, validationError);
    }

    const userStats = await shopHandler.getUserBalance(guildId, userId);
    const currentBalance = userStats?.coin || 0;

    const totalPrice = product.price * quantity;
    const futureBalance = currentBalance - totalPrice;

    if (futureBalance < 0) {
      return sendErrorResponse(
        context,
        `❌ Saldo insuficiente! Você tem ${currentBalance} moedas e precisa de ${totalPrice} moedas.`
      );
    }

    const confirmationEmbed = createConfirmationEmbed(product, quantity, totalPrice, currentBalance, futureBalance);
    const confirmationButtons = createConfirmationButtons(product._id, quantity);

    const response = {
      embeds: [confirmationEmbed],
      components: [confirmationButtons],
      ephemeral: true,
    };

    if (context.deferred) {
      return context.editReply(response);
    } else {
      return context.reply(response);
    }
  } catch (error) {
    console.error("Buy command error:", error);

    const errorResponse = {
      content: `❌ Erro ao processar compra: ${error.message}`,
      ephemeral: true,
    };

    if (context.deferred) {
      return context.editReply(errorResponse);
    } else {
      return context.reply(errorResponse);
    }
  }
}

async function findProduct(guildId, identifier) {
  try {
    let product = await shopHandler.getProduct(guildId, identifier);

    if (product) {
      return product;
    }
    // Use MongoDB search with precise matching
    product = await Product.findProductByName(guildId, identifier);

    return product;
  } catch (error) {
    console.error("Error finding product:", error);
    return null;
  }
}

function createConfirmationEmbed(product, quantity, totalPrice, currentBalance, futureBalance) {
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("🛒 Confirmação de Compra")
    .setDescription(`Você está prestes a comprar **${product.name}**`)
    .addFields(
      {
        name: "🛍️ Produto",
        value: product.name,
        inline: true,
      },
      {
        name: "📦 Quantidade",
        value: `${quantity}x`,
        inline: true,
      },
      {
        name: "💰 Preço Unitário",
        value: `${product.price} moedas`,
        inline: true,
      },
      {
        name: "💵 Valor Total",
        value: `**${totalPrice}** moedas`,
        inline: true,
      },
      {
        name: "🏦 Saldo Atual",
        value: `${currentBalance} moedas`,
        inline: true,
      },
      {
        name: "💳 Saldo Futuro",
        value: `${futureBalance} moedas`,
        inline: true,
      }
    )
    .setTimestamp();

  if (product.image_url) {
    embed.setThumbnail(product.image_url);
  }

  if (product.description) {
    embed.addFields({
      name: "📝 Descrição",
      value: product.description.length > 200 ? product.description.substring(0, 197) + "..." : product.description,
      inline: false,
    });
  }

  return embed;
}

function createConfirmationButtons(productId, quantity) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`confirm_buy|${productId}|${quantity}`)
      .setLabel("✅ Confirmar Compra")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`cancel_buy|${productId}|${quantity}`)
      .setLabel("❌ Cancelar")
      .setStyle(ButtonStyle.Danger)
  );
}
