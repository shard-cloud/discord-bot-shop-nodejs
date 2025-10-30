const { shopHandler } = require("@src/handlers");

/**
 * Handle shop category selection
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').StringSelectMenuInteraction} interaction
 */
module.exports = async (client, interaction) => {
  try {
    // Defer the update first to prevent timeout
    await interaction.deferUpdate();

    const category = interaction.values[0];
    const guildId = interaction.guild.id;

    const { products, totalPages, currentPage } = await shopHandler.getProducts(guildId, category);
    const categories = await shopHandler.getCategories(guildId);

    const embed = shopHandler.createShopEmbed(products, currentPage, totalPages, category);
    const components = shopHandler.createShopComponents(categories, currentPage, totalPages, products, category);

    await interaction.editReply({
      embeds: [embed],
      components,
    });
  } catch (error) {
    console.error("Category selection error:", error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ Erro ao mudar categoria.", ephemeral: true });
    } else if (interaction.deferred) {
      await interaction.editReply({ content: "❌ Erro ao mudar categoria." });
    }
  }
};
