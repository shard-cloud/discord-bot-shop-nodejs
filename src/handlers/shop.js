const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ButtonStyle } = require("discord.js");
const Product = require("@schemas/Product");
const Transaction = require("@schemas/Transaction");
const { getMemberStats } = require("@schemas/MemberStats");
const { EMBED_COLORS } = require("@root/config");
const mongoose = require("mongoose");

const ITEMS_PER_PAGE = 5;

/**
 * Convert category display name to internal value
 * @param {string} categoryDisplay
 */
function getCategoryValue(categoryDisplay) {
  return categoryDisplay === "Todos" ? "all" : categoryDisplay;
}

/**
 * Convert category internal value to display name
 * @param {string} categoryValue
 */
function getCategoryDisplay(categoryValue) {
  return categoryValue === "all" ? "Todos" : categoryValue;
}

/**
 * Generate a unique product ID
 */
function generateProductId() {
  return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique transaction ID
 */
function generateTransactionId() {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create shop embed with products
 * @param {Array} products
 * @param {number} currentPage
 * @param {number} totalPages
 * @param {string} category
 */
function createShopEmbed(products, currentPage = 1, totalPages = 1, category = "all") {
  const categoryDisplay = getCategoryDisplay(category);
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setTitle("🛒 Loja do Servidor")
    .setDescription(`**Categoria:** ${categoryDisplay}\n**Página:** ${currentPage}/${totalPages}`)
    .setFooter({ text: `Página ${currentPage} de ${totalPages}` })
    .setTimestamp();

  if (products.length === 0) {
    embed.addFields({
      name: "📦 Produtos",
      value: "Nenhum produto disponível nesta categoria.",
      inline: false,
    });
  } else {
    for (let i = 0; i < products.length; i += 3) {
      const rowProducts = products.slice(i, i + 3);

      rowProducts.forEach((product) => {
        const stockStatus = product.stock > 0 ? `✅ ${product.stock}` : "❌ Sem estoque";
        const priceText = `💰 ${product.price} moedas`;

        embed.addFields({
          name: `🛍️ ${product.name}`,
          value: `${product.description}\n${priceText}\n${stockStatus}`,
          inline: true,
        });
      });

      if (rowProducts.length < 3) {
        for (let j = rowProducts.length; j < 3; j++) {
          embed.addFields({
            name: "\u200b",
            value: "\u200b",
            inline: true,
          });
        }
      }
    }
  }

  return embed;
}

/**
 * Create product management embed
 * @param {Object} product
 */
function createProductEmbed(product) {
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setTitle(`🛍️ ${product.name}`)
    .setDescription(product.description)
    .addFields(
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
      }
    )
    .setTimestamp();

  if (product.image_url) {
    embed.setImage(product.image_url);
  }

  return embed;
}

/**
 * Create transaction embed
 * @param {Object} transaction
 * @param {Object} product
 * @param {Object} buyer
 */
function createTransactionEmbed(transaction, product, buyer) {
  const timestamp = Math.floor(transaction.created_at.getTime() / 1000);
  const dateFormatted = `<t:${timestamp}:F>`;
  const relativeTime = `<t:${timestamp}:R>`;

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setTitle("🛒 Nova Compra Realizada")
    .setDescription(`**${buyer.tag}** comprou **${product.name}** ${relativeTime}`)
    .addFields(
      {
        name: "👤 Comprador",
        value: `${buyer.tag}\n(${buyer.id})`,
        inline: true,
      },
      {
        name: "🛍️ Produto",
        value: product.name,
        inline: true,
      },
      {
        name: "📦 Quantidade",
        value: `${transaction.quantity}x`,
        inline: true,
      },
      {
        name: "💰 Preço Unitário",
        value: `${product.price} moedas`,
        inline: true,
      },
      {
        name: "💵 Preço Total",
        value: `**${transaction.total_price}** moedas`,
        inline: true,
      },
      {
        name: "📊 Status",
        value: transaction.status === "completed" ? "✅ Concluída" : "⏳ Pendente",
        inline: true,
      },
      {
        name: "📅 Data da Compra",
        value: dateFormatted,
        inline: false,
      },
      {
        name: "🆔 ID da Transação",
        value: `\`${transaction._id}\``,
        inline: false,
      }
    )
    .setThumbnail(buyer.displayAvatarURL({ dynamic: true }))
    .setTimestamp();

  if (product.image_url) {
    embed.setImage(product.image_url);
  }

  if (product.description) {
    embed.addFields({
      name: "📝 Descrição do Produto",
      value: product.description,
      inline: false,
    });
  }

  return embed;
}

/**
 * Create shop components (buttons and select menu)
 * @param {Array} categories
 * @param {number} currentPage
 * @param {number} totalPages
 * @param {Array} products
 * @param {string} category
 */
function createShopComponents(categories, currentPage = 1, totalPages = 1, products = [], category = "all") {
  const components = [];

  if (categories.length > 0) {
    const categoryOptions = [
      {
        label: "Todos os Produtos",
        value: "all",
        description: "Ver todos os produtos disponíveis",
        emoji: "🛒",
      },
    ];

    categories.forEach((category) => {
      categoryOptions.push({
        label: category,
        value: category,
        description: `Ver produtos da categoria ${category}`,
        emoji: "📂",
      });
    });

    const categorySelect = new StringSelectMenuBuilder()
      .setCustomId("shop_category")
      .setPlaceholder("Selecione uma categoria")
      .addOptions(categoryOptions);

    components.push(new ActionRowBuilder().addComponents(categorySelect));
  }

  const navButtons = [];

  if (totalPages > 1) {
    navButtons.push(
      new ButtonBuilder()
        .setCustomId(`shop_prev|${currentPage}-${totalPages}|${category}`)
        .setEmoji("⬅️")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === 1),
      new ButtonBuilder()
        .setCustomId(`shop_next|${currentPage}-${totalPages}|${category}`)
        .setEmoji("➡️")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === totalPages)
    );
  }

  if (products.length > 0) {
    const availableProducts = products.filter((p) => p.stock > 0);

    if (availableProducts.length > 0) {
      const productOptions = availableProducts.map((product) => {
        const productName = product.name.length > 17 ? product.name.substring(0, 14) + "..." : product.name;
        return {
          label: `Comprar ${productName}`,
          value: product._id,
          description: `💰 ${product.price} moedas - ${product.stock} em estoque`,
          emoji: "🛒",
        };
      });

      const productSelect = new StringSelectMenuBuilder()
        .setCustomId("shop_purchase")
        .setPlaceholder("Selecione um produto para comprar")
        .addOptions(productOptions);

      components.push(new ActionRowBuilder().addComponents(productSelect));
    }
  }

  if (navButtons.length > 0) {
    for (let i = 0; i < navButtons.length; i += 5) {
      const rowButtons = navButtons.slice(i, i + 5);
      components.push(new ActionRowBuilder().addComponents(rowButtons));
    }
  }

  return components;
}

/**
 * Create product management components
 * @param {string} productId
 */
function createProductManagementComponents(productId) {
  const components = [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`edit_product_${productId}`)
        .setLabel("Editar Produto")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("✏️"),
      new ButtonBuilder()
        .setCustomId(`delete_product_${productId}`)
        .setLabel("Deletar Produto")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🗑️"),
      new ButtonBuilder()
        .setCustomId(`stock_product_${productId}`)
        .setLabel("Gerenciar Estoque")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("📦")
    ),
  ];

  return components;
}

module.exports = {
  generateProductId,
  generateTransactionId,
  createShopEmbed,
  createProductEmbed,
  createTransactionEmbed,
  createShopComponents,
  createProductManagementComponents,
  getCategoryValue,
  getCategoryDisplay,

  /**
   * Get products with pagination
   * @param {string} guildId
   * @param {string} category
   * @param {number} page
   */
  async getProducts(guildId, category = "all", page = 1) {
    let products;

    if (category === "all") {
      products = await Product.getProducts(guildId);
    } else {
      products = await Product.getProductsByCategory(guildId, category);
    }

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      totalPages,
      currentPage: page,
    };
  },

  /**
   * Get a single product
   * @param {string} guildId
   * @param {string} productId
   */
  async getProduct(guildId, productId) {
    return Product.getProduct(guildId, productId);
  },

  /**
   * Get all products for a guild (for autocomplete and search)
   * @param {string} guildId
   */
  async getAllProductsForGuild(guildId) {
    try {
      const products = await Product.getProducts(guildId, 1000);
      return products || [];
    } catch (error) {
      console.error("Error in getAllProductsForGuild:", error);
      return [];
    }
  },

  /**
   * Get user balance
   * @param {string} guildId
   * @param {string} userId
   */
  async getUserBalance(guildId, userId) {
    return getMemberStats(guildId, userId);
  },

  /**
   * Search products by name
   * @param {string} guildId
   * @param {string} name
   */
  async searchProductsByName(guildId, name) {
    return Product.searchProductsByName(guildId, name);
  },

  /**
   * Get shop categories
   * @param {string} guildId
   */
  async getCategories(guildId) {
    return Product.getCategories(guildId);
  },

  /**
   * Create a new product
   * @param {Object} productData
   */
  async createProduct(productData) {
    const productId = generateProductId();
    const product = {
      _id: productId,
      guild_id: productData.guildId,
      created_by: productData.createdBy,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      category: productData.category || "Geral",
      image_url: productData.imageUrl,
      is_active: true,
    };

    return Product.createProduct(product);
  },

  /**
   * Update a product
   * @param {string} guildId
   * @param {string} productId
   * @param {Object} updateData
   */
  async updateProduct(guildId, productId, updateData) {
    return Product.updateProduct(guildId, productId, updateData);
  },

  /**
   * Delete a product
   * @param {string} guildId
   * @param {string} productId
   */
  async deleteProduct(guildId, productId) {
    return Product.deleteProduct(guildId, productId);
  },

  /**
   * Update product stock
   * @param {string} guildId
   * @param {string} productId
   * @param {number} quantity
   */
  async updateStock(guildId, productId, quantity) {
    return Product.updateStock(guildId, productId, quantity);
  },

  /**
   * Process a purchase
   * @param {string} guildId
   * @param {string} buyerId
   * @param {string} productId
   * @param {number} quantity
   */
  async processPurchase(guildId, buyerId, productId, quantity) {
    const product = await Product.getProduct(guildId, productId);
    if (!product) {
      throw new Error("Produto não encontrado");
    }

    if (product.stock < quantity) {
      throw new Error("Estoque insuficiente");
    }

    if (!product.is_active) {
      throw new Error("Produto não está disponível");
    }

    const totalPrice = product.price * quantity;

    const memberStats = await getMemberStats(guildId, buyerId);
    if (memberStats.coin < totalPrice) {
      throw new Error("Saldo insuficiente");
    }

    const transactionId = generateTransactionId();

    const transaction = await Transaction.createTransaction({
      _id: transactionId,
      guild_id: guildId,
      buyer_id: buyerId,
      product_id: productId,
      product_name: product.name,
      quantity,
      total_price: totalPrice,
      status: "pending",
    });

    const MemberStatsModel = mongoose.model("member-stats");
    await MemberStatsModel.updateOne({ guild_id: guildId, member_id: buyerId }, { $inc: { coin: -totalPrice } });

    await Product.updateStock(guildId, productId, -quantity);

    await Transaction.updateTransactionStatus(transactionId, "completed");

    return {
      transaction,
      product,
      totalPrice,
    };
  },

  /**
   * Get user transactions
   * @param {string} guildId
   * @param {string} userId
   */
  async getUserTransactions(guildId, userId) {
    return Transaction.getUserTransactions(guildId, userId);
  },

  /**
   * Get guild transactions
   * @param {string} guildId
   */
  async getGuildTransactions(guildId) {
    return Transaction.getGuildTransactions(guildId);
  },
};
