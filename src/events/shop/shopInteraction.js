const { shopHandler } = require("@src/handlers");
const { getMemberStats } = require("@schemas/MemberStats");
const EconomyUtils = require("@helpers/EconomyUtils");
const LogUtils = require("@helpers/LogUtils");
const mongoose = require("mongoose");
const { getInventory } = require("@src/commands/utility/inventory");
const { viewTransactions } = require("@src/commands/utility/transactions");

/**
 * Handle shop button interactions
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').ButtonInteraction} interaction
 */
module.exports = async (client, interaction) => {
  try {
    const { customId } = interaction;
    const guildId = interaction.guild.id;

    if (interaction.isButton()) {
      await handleButtonInteraction(interaction, customId, guildId);
    } else if (interaction.isStringSelectMenu()) {
      await handleSelectMenuInteraction(interaction, customId, guildId);
    }
  } catch (error) {
    console.error("Shop interaction error:", error);
    try {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: "❌ Erro ao processar interação.", ephemeral: true });
      } else if (interaction.deferred) {
        await interaction.followUp({ content: "❌ Erro ao processar interação.", ephemeral: true });
      }
    } catch (e) {
      console.error("Error sending error message:", e);
    }
  }
};

// Button interaction routing map
const BUTTON_HANDLERS = {
  buy_: (interaction, customId, guildId) => {
    const productId = customId.replace("buy_", "");
    return handlePurchase(interaction, productId, guildId);
  },

  shop_prev: async (interaction, customId, guildId) => {
    await interaction.deferUpdate();
    const [action, pageInfo, category] = customId.split("|");
    const [currentPage, totalPages] = pageInfo.split("-").map(Number);
    return handleNavigation(interaction, "prev", guildId, currentPage, totalPages, category);
  },

  shop_next: async (interaction, customId, guildId) => {
    await interaction.deferUpdate();
    const [action, pageInfo, category] = customId.split("|");
    const [currentPage, totalPages] = pageInfo.split("-").map(Number);
    return handleNavigation(interaction, "next", guildId, currentPage, totalPages, category);
  },

  edit_product_: (interaction, customId, guildId) => {
    const productId = customId.replace("edit_product_", "");
    return handleEditProduct(interaction, productId, guildId);
  },

  delete_product_: (interaction, customId, guildId) => {
    const productId = customId.replace("delete_product_", "");
    return handleDeleteProduct(interaction, productId, guildId);
  },

  stock_product_: (interaction, customId, guildId) => {
    const productId = customId.replace("stock_product_", "");
    return handleStockProduct(interaction, productId, guildId);
  },

  confirm_buy: (interaction, customId, guildId) => {
    const [action, productId, quantity] = customId.split("|");
    return handleConfirmPurchase(interaction, productId, parseInt(quantity), guildId);
  },

  cancel_buy: (interaction) => handleCancelPurchase(interaction),

  confirm_transfer: (interaction, customId) => {
    const [action, targetUserId, amount, encodedReason] = customId.split("|");
    const reason = decodeURIComponent(encodedReason);
    return handleConfirmTransfer(interaction, targetUserId, parseInt(amount), reason);
  },

  cancel_transfer: (interaction) => handleCancelTransfer(interaction),

  inventory_prev: async (interaction, customId) => {
    await interaction.deferUpdate();
    const [action, pageInfo, targetUserId] = customId.split("|");
    const [currentPage, totalPages] = pageInfo.split("-").map(Number);
    return handleInventoryNavigation(interaction, "prev", currentPage, totalPages, targetUserId);
  },

  inventory_next: async (interaction, customId) => {
    await interaction.deferUpdate();
    const [action, pageInfo, targetUserId] = customId.split("|");
    const [currentPage, totalPages] = pageInfo.split("-").map(Number);
    return handleInventoryNavigation(interaction, "next", currentPage, totalPages, targetUserId);
  },

  transactions_prev: async (interaction, customId) => {
    await interaction.deferUpdate();
    const [action, pageInfo, targetUserId] = customId.split("|");
    const [currentPage, totalPages] = pageInfo.split("-").map(Number);
    return handleTransactionsNavigation(interaction, "prev", currentPage, totalPages, targetUserId);
  },

  transactions_next: async (interaction, customId) => {
    await interaction.deferUpdate();
    const [action, pageInfo, targetUserId] = customId.split("|");
    const [currentPage, totalPages] = pageInfo.split("-").map(Number);
    return handleTransactionsNavigation(interaction, "next", currentPage, totalPages, targetUserId);
  },
};

// Select menu interaction routing map
const SELECT_HANDLERS = {
  shop_purchase: (interaction, guildId) => {
    const productId = interaction.values[0];
    return handlePurchase(interaction, productId, guildId);
  },
};

/**
 * Handle button interactions using routing map
 * @param {Object} interaction
 * @param {string} customId
 * @param {string} guildId
 */
async function handleButtonInteraction(interaction, customId, guildId) {
  const handlerKey = Object.keys(BUTTON_HANDLERS).find((key) => customId.startsWith(key));

  if (handlerKey) {
    await BUTTON_HANDLERS[handlerKey](interaction, customId, guildId);
  }
}

/**
 * Handle select menu interactions using routing map
 * @param {Object} interaction
 * @param {string} customId
 * @param {string} guildId
 */
async function handleSelectMenuInteraction(interaction, customId, guildId) {
  const handler = SELECT_HANDLERS[customId];

  if (handler) {
    await handler(interaction, guildId);
  }
}

async function handlePurchase(interaction, productId, guildId) {
  try {
    const result = await shopHandler.processPurchase(guildId, interaction.user.id, productId, 1);

    const embed = {
      title: "✅ Compra Realizada com Sucesso!",
      description: `Você comprou **${result.product.name}** por **${result.totalPrice}** moedas.`,
      color: 0x00ff00,
      fields: [
        {
          name: "🛍️ Produto",
          value: result.product.name,
          inline: true,
        },
        {
          name: "💰 Preço Total",
          value: `${result.totalPrice} moedas`,
          inline: true,
        },
        {
          name: "🆔 ID da Transação",
          value: `\`${result.transaction._id}\``,
          inline: false,
        },
      ],
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });

    try {
      const logChannel = interaction.guild.channels.cache.find(
        (channel) => channel.name.includes("shop") || channel.name.includes("loja")
      );

      if (logChannel) {
        const logEmbed = {
          title: "🛒 Nova Compra Realizada",
          description: `**${interaction.user.tag}** comprou **${result.product.name}**`,
          color: 0x00ff00,
          fields: [
            {
              name: "👤 Comprador",
              value: `${interaction.user.tag} (${interaction.user.id})`,
              inline: true,
            },
            {
              name: "🛍️ Produto",
              value: result.product.name,
              inline: true,
            },
            {
              name: "💰 Preço",
              value: `${result.totalPrice} moedas`,
              inline: true,
            },
          ],
          timestamp: new Date(),
        };

        await logChannel.send({ embeds: [logEmbed] });
      }
    } catch (logError) {
      console.error("Error logging purchase:", logError);
    }
  } catch (error) {
    const embed = {
      title: "❌ Erro na Compra",
      description: error.message,
      color: 0xff0000,
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

async function handleNavigation(interaction, direction, guildId, currentPage, totalPages, category) {
  try {
    let newPage = currentPage;
    if (direction === "prev" && currentPage > 1) {
      newPage = currentPage - 1;
    } else if (direction === "next" && currentPage < totalPages) {
      newPage = currentPage + 1;
    } else {
      await interaction.editReply({ content: "❌ Não é possível navegar nesta direção." });
      return;
    }

    const { products, totalPages: newTotalPages } = await shopHandler.getProducts(guildId, category, newPage);
    const categories = await shopHandler.getCategories(guildId);

    const newEmbed = shopHandler.createShopEmbed(products, newPage, newTotalPages, category);
    const components = shopHandler.createShopComponents(categories, newPage, newTotalPages, products, category);

    await interaction.editReply({
      embeds: [newEmbed],
      components,
    });
  } catch (error) {
    console.error("Navigation error:", error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ Erro ao navegar na loja.", ephemeral: true });
    } else if (interaction.deferred) {
      await interaction.editReply({ content: "❌ Erro ao navegar na loja." });
    }
  }
}

async function handleEditProduct(interaction, productId, guildId) {
  if (!interaction.member.permissions.has("Administrator")) {
    await interaction.reply({ content: "❌ Você não tem permissão para editar produtos.", ephemeral: true });
    return;
  }

  try {
    const product = await shopHandler.getProduct(guildId, productId);
    if (!product) {
      await interaction.reply({ content: "❌ Produto não encontrado.", ephemeral: true });
      return;
    }

    const embed = {
      title: "✏️ Editar Produto",
      description: `**${product.name}**\n${product.description}`,
      color: 0xffff00,
      fields: [
        { name: "💰 Preço", value: `${product.price} moedas`, inline: true },
        { name: "📦 Estoque", value: `${product.stock} unidades`, inline: true },
        { name: "🏷️ Categoria", value: product.category, inline: true },
      ],
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error("Edit product error:", error);
    await interaction.reply({ content: "❌ Erro ao editar produto.", ephemeral: true });
  }
}

async function handleDeleteProduct(interaction, productId, guildId) {
  if (!interaction.member.permissions.has("Administrator")) {
    await interaction.reply({ content: "❌ Você não tem permissão para deletar produtos.", ephemeral: true });
    return;
  }

  try {
    const result = await shopHandler.deleteProduct(guildId, productId);
    if (!result) {
      await interaction.reply({ content: "❌ Produto não encontrado.", ephemeral: true });
      return;
    }

    const embed = {
      title: "🗑️ Produto Deletado",
      description: `**${result.name}** foi removido da loja.`,
      color: 0xff0000,
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error("Delete product error:", error);
    await interaction.reply({ content: "❌ Erro ao deletar produto.", ephemeral: true });
  }
}

async function handleStockProduct(interaction, productId, guildId) {
  if (!interaction.member.permissions.has("Administrator")) {
    await interaction.reply({ content: "❌ Você não tem permissão para gerenciar estoque.", ephemeral: true });
    return;
  }

  try {
    const product = await shopHandler.getProduct(guildId, productId);
    if (!product) {
      await interaction.reply({ content: "❌ Produto não encontrado.", ephemeral: true });
      return;
    }

    const embed = {
      title: "📦 Gerenciar Estoque",
      description: `**${product.name}**\nEstoque atual: **${product.stock}** unidades`,
      color: 0x0099ff,
      fields: [
        { name: "💰 Preço", value: `${product.price} moedas`, inline: true },
        { name: "🏷️ Categoria", value: product.category, inline: true },
        { name: "📊 Status", value: product.stock > 0 ? "✅ Disponível" : "❌ Sem estoque", inline: true },
      ],
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (error) {
    console.error("Stock management error:", error);
    await interaction.reply({ content: "❌ Erro ao gerenciar estoque.", ephemeral: true });
  }
}

async function handleConfirmPurchase(interaction, productId, quantity, guildId) {
  try {
    const result = await shopHandler.processPurchase(guildId, interaction.user.id, productId, quantity);

    const embed = {
      title: "✅ Compra Realizada com Sucesso!",
      description: `Você comprou **${quantity}x ${result.product.name}** por **${result.totalPrice}** moedas.`,
      color: 0x00ff00,
      fields: [
        {
          name: "🛍️ Produto",
          value: result.product.name,
          inline: true,
        },
        {
          name: "📦 Quantidade",
          value: `${quantity}x`,
          inline: true,
        },
        {
          name: "💰 Valor Total",
          value: `${result.totalPrice} moedas`,
          inline: true,
        },
        {
          name: "🆔 ID da Transação",
          value: `\`${result.transaction._id}\``,
          inline: false,
        },
      ],
      timestamp: new Date(),
    };

    if (result.product.image_url) {
      embed.thumbnail = { url: result.product.image_url };
    }

    await interaction.update({ embeds: [embed], components: [] });

    try {
      const logChannel = interaction.guild.channels.cache.find(
        (channel) => channel.name.includes("shop") || channel.name.includes("loja")
      );

      if (logChannel) {
        const logEmbed = {
          title: "🛒 Nova Compra Realizada",
          description: `**${interaction.user.tag}** comprou **${quantity}x ${result.product.name}**`,
          color: 0x00ff00,
          fields: [
            {
              name: "👤 Comprador",
              value: `${interaction.user.tag} (${interaction.user.id})`,
              inline: true,
            },
            {
              name: "🛍️ Produto",
              value: result.product.name,
              inline: true,
            },
            {
              name: "📦 Quantidade",
              value: `${quantity}x`,
              inline: true,
            },
            {
              name: "💰 Valor Total",
              value: `${result.totalPrice} moedas`,
              inline: true,
            },
          ],
          timestamp: new Date(),
        };

        await logChannel.send({ embeds: [logEmbed] });
      }
    } catch (logError) {
      console.error("Error logging purchase:", logError);
    }
  } catch (error) {
    const embed = {
      title: "❌ Erro na Compra",
      description: error.message,
      color: 0xff0000,
      timestamp: new Date(),
    };

    await interaction.update({ embeds: [embed], components: [] });
  }
}

async function handleCancelPurchase(interaction) {
  try {
    const embed = {
      title: "❌ Compra Cancelada",
      description: "Você cancelou a compra. Nenhuma transação foi realizada.",
      color: 0xff9900,
      timestamp: new Date(),
    };

    await interaction.update({ embeds: [embed], components: [] });
  } catch (error) {
    console.error("Cancel purchase error:", error);
    await interaction.reply({ content: "❌ Erro ao cancelar compra.", ephemeral: true });
  }
}

async function handleConfirmTransfer(interaction, targetUserId, amount, reason) {
  try {
    const guildId = interaction.guild.id;
    const senderId = interaction.user.id;

    // Get both users' current stats
    const [senderStats, receiverStats] = await Promise.all([
      getMemberStats(guildId, senderId),
      getMemberStats(guildId, targetUserId),
    ]);

    const senderBalance = senderStats.coin || 0;

    // Final balance check
    if (senderBalance < amount) {
      const embed = {
        title: "❌ Transferência Falhou",
        description: `Saldo insuficiente! Você tem ${EconomyUtils.formatNumber(senderBalance)} moedas.`,
        color: 0xff0000,
        timestamp: new Date(),
      };
      await interaction.update({ embeds: [embed], components: [] });
      return;
    }

    // Perform transfer
    const MemberStatsModel = mongoose.model("member-stats");

    await Promise.all([
      // Deduct from sender
      MemberStatsModel.updateOne({ guild_id: guildId, member_id: senderId }, { $inc: { coin: -amount } }),
      // Add to receiver
      MemberStatsModel.updateOne({ guild_id: guildId, member_id: targetUserId }, { $inc: { coin: amount } }),
    ]);

    // Get updated balances
    const [newSenderStats, newReceiverStats] = await Promise.all([
      getMemberStats(guildId, senderId),
      getMemberStats(guildId, targetUserId),
    ]);

    const transferStatus = EconomyUtils.getTransferStatus(amount);
    const targetUser = await interaction.client.users.fetch(targetUserId);

    const embed = {
      title: "✅ Transferência Realizada!",
      description: `${transferStatus.description}`,
      color: 0x00ff00,
      fields: [
        {
          name: "👤 Remetente",
          value: `${interaction.user.tag}`,
          inline: true,
        },
        {
          name: "👥 Destinatário",
          value: `${targetUser.tag}`,
          inline: true,
        },
        {
          name: "💰 Quantidade",
          value: `**${EconomyUtils.formatNumber(amount)}** moedas`,
          inline: true,
        },
        {
          name: "🏦 Seu Novo Saldo",
          value: `**${EconomyUtils.formatNumber(newSenderStats.coin)}** moedas`,
          inline: true,
        },
        {
          name: "💳 Saldo do Destinatário",
          value: `**${EconomyUtils.formatNumber(newReceiverStats.coin)}** moedas`,
          inline: true,
        },
        {
          name: "📝 Motivo",
          value: reason,
          inline: true,
        },
      ],
      timestamp: new Date(),
    };

    await interaction.update({ embeds: [embed], components: [] });

    // Log the transfer
    try {
      const logEmbed = {
        title: "💸 Transferência de Moedas",
        description: `**${interaction.user.tag}** transferiu **${EconomyUtils.formatNumber(amount)}** moedas para **${
          targetUser.tag
        }**`,
        color: 0x0099ff,
        fields: [
          {
            name: "👤 Remetente",
            value: `${interaction.user.tag} (${interaction.user.id})`,
            inline: true,
          },
          {
            name: "👥 Destinatário",
            value: `${targetUser.tag} (${targetUser.id})`,
            inline: true,
          },
          {
            name: "💰 Quantidade",
            value: `${EconomyUtils.formatNumber(amount)} moedas`,
            inline: true,
          },
          {
            name: "📝 Motivo",
            value: reason,
            inline: false,
          },
        ],
        timestamp: new Date(),
      };

      LogUtils.sendLog(interaction.guild, "economy", logEmbed).catch(() => {});
    } catch (logError) {
      console.error("Error logging transfer:", logError);
    }
  } catch (error) {
    console.error("Transfer error:", error);
    const embed = {
      title: "❌ Erro na Transferência",
      description: `Erro ao processar transferência: ${error.message}`,
      color: 0xff0000,
      timestamp: new Date(),
    };
    await interaction.update({ embeds: [embed], components: [] });
  }
}

async function handleCancelTransfer(interaction) {
  try {
    const embed = {
      title: "❌ Transferência Cancelada",
      description: "Você cancelou a transferência. Nenhuma moeda foi transferida.",
      color: 0xff9900,
      timestamp: new Date(),
    };

    await interaction.update({ embeds: [embed], components: [] });
  } catch (error) {
    console.error("Cancel transfer error:", error);
    await interaction.reply({ content: "❌ Erro ao cancelar transferência.", ephemeral: true });
  }
}

async function handleTransactionsNavigation(interaction, direction, currentPage, totalPages, targetUserId) {
  try {
    let newPage = currentPage;
    if (direction === "prev" && currentPage > 1) {
      newPage = currentPage - 1;
    } else if (direction === "next" && currentPage < totalPages) {
      newPage = currentPage + 1;
    } else {
      await interaction.editReply({ content: "❌ Não é possível navegar nesta direção." });
      return;
    }

    const response = await viewTransactions(interaction, targetUserId, newPage);

    await interaction.editReply({
      embeds: response.embeds,
      components: response.components || [],
    });
  } catch (error) {
    console.error("Transactions navigation error:", error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ Erro ao navegar nas transações.", ephemeral: true });
    } else if (interaction.deferred) {
      await interaction.editReply({ content: "❌ Erro ao navegar nas transações." });
    }
  }
}

async function handleInventoryNavigation(interaction, direction, currentPage, totalPages, targetUserId) {
  try {
    let newPage = currentPage;
    if (direction === "prev" && currentPage > 1) {
      newPage = currentPage - 1;
    } else if (direction === "next" && currentPage < totalPages) {
      newPage = currentPage + 1;
    } else {
      await interaction.editReply({ content: "❌ Não é possível navegar nesta direção." });
      return;
    }

    // Get target user
    const targetUser = await interaction.client.users.fetch(targetUserId);

    const response = await getInventory(interaction, targetUser, newPage);

    await interaction.editReply({
      embeds: response.embeds,
      components: response.components || [],
    });
  } catch (error) {
    console.error("Inventory navigation error:", error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ Erro ao navegar no inventário.", ephemeral: true });
    } else if (interaction.deferred) {
      await interaction.editReply({ content: "❌ Erro ao navegar no inventário." });
    }
  }
}
