const { MessageFlags } = require("discord.js");
const { getSettings } = require("@schemas/Guild");
const { commandHandler, contextHandler, statsHandler } = require("@src/handlers");
const shopInteractionHandler = require("@src/events/shop/shopInteraction");
const shopCategoryHandler = require("@src/events/shop/shopCategory");

// Shop interaction patterns
const SHOP_INTERACTION_PATTERNS = [
  "buy_",
  "edit_product_",
  "delete_product_",
  "stock_product_",
  "shop_prev",
  "shop_next",
  "confirm_buy",
  "cancel_buy",
  "confirm_transfer",
  "cancel_transfer",
  "inventory_prev",
  "inventory_next",
  "transactions_prev",
  "transactions_next",
];

/**
 * Check if interaction is a shop-related interaction
 * @param {string} customId
 * @returns {boolean}
 */
function isShopInteraction(customId) {
  return SHOP_INTERACTION_PATTERNS.some((pattern) => customId.startsWith(pattern));
}
/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').BaseInteraction} interaction
 */
module.exports = async (client, interaction) => {
  // if (!interaction.guild) {
  //   return interaction
  //     .reply({ content: "Command can only be executed in a discord server", ephemeral: true })
  //     .catch(() => {});
  // }

  // Slash Commands
  if (interaction.isChatInputCommand()) await commandHandler.handleSlashCommand(interaction);
  // Context Menu
  else if (interaction.isContextMenuCommand()) {
    const context = client.contextMenus.get(interaction.commandName);
    if (context) await contextHandler.handleContext(interaction, context);
    else return interaction.reply({ content: "An error has occurred", flags: MessageFlags.Ephemeral }).catch(() => {});
  }

  // Auto-complete
  else if (interaction.isAutocomplete()) await commandHandler.handleAutoComplete(interaction);
  // Buttons
  else if (interaction.isButton()) {
    if (isShopInteraction(interaction.customId)) {
      return shopInteractionHandler(client, interaction);
    }
  }

  // Select Menus
  else if (interaction.isStringSelectMenu()) {
    // Handle shop category selection
    if (interaction.customId === "shop_category") {
      return shopCategoryHandler(client, interaction);
    }
    // Handle shop product purchase
    else if (interaction.customId === "shop_purchase") {
      return shopInteractionHandler(client, interaction);
    }
  }

  // Modals
  // else if (interaction.type === InteractionType.ModalSubmit) {
  //   switch (interaction.customId) {
  //     case "SUGGEST_APPROVE_MODAL":
  //       return suggestionHandler.handleApproveModal(interaction);
  //   }
  // }

  if (interaction.guild) {
    const settings = await getSettings(interaction.guild);

    if (settings.stats.enabled) statsHandler.trackInteractionStats(interaction).catch(() => {});
  }
};
