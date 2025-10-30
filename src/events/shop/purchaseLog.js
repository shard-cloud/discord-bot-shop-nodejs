const { EmbedBuilder } = require("discord.js");
const { getSettings } = require("@schemas/Guild");

/**
 * Log purchase events
 * @param {import('@src/structures').BotClient} client
 * @param {Object} purchaseData
 */
module.exports = async (client, purchaseData) => {
  try {
    const { guild, buyer, product, transaction } = purchaseData;

    // Obter configurações do servidor
    const settings = await getSettings(guild);

    // Verificar se os logs estão habilitados e se existe um canal de logs da loja configurado
    if (!settings.logs?.enabled || !settings.logs?.shop) {
      // Fallback para o método antigo de buscar o canal
      const logChannel = guild.channels.cache.find(
        (channel) =>
          channel.name.includes("shop") ||
          channel.name.includes("loja") ||
          channel.name.includes("purchases") ||
          channel.name.includes("compras")
      );

      if (!logChannel) return;

      // Enviar log no canal encontrado
      await sendLogEmbed(logChannel, buyer, product, transaction);
      return;
    }

    // Usar o canal configurado nas configurações
    const logChannel = guild.channels.cache.get(settings.logs.shop);
    if (!logChannel) return;

    // Enviar log no canal configurado
    await sendLogEmbed(logChannel, buyer, product, transaction);
  } catch (error) {
    client.logger.error("Error logging purchase:", error);
  }
};

/**
 * Envia o embed de log no canal especificado
 * @param {import('discord.js').TextChannel} channel
 * @param {import('discord.js').User} buyer
 * @param {Object} product
 * @param {Object} transaction
 */
async function sendLogEmbed(channel, buyer, product, transaction) {
  // Formatar data e hora
  const timestamp = Math.floor(transaction.created_at.getTime() / 1000);
  const dateFormatted = `<t:${timestamp}:F>`;
  const relativeTime = `<t:${timestamp}:R>`;

  // Criar embed principal
  const embed = new EmbedBuilder()
    .setTitle("🛒 Nova Compra Realizada")
    .setDescription(`**${buyer.tag}** comprou **${product.name}** ${relativeTime}`)
    .setColor(0x00ff00)
    .addFields(
      // Informações do comprador
      {
        name: "👤 Comprador",
        value: `${buyer.tag}\n(${buyer.id})`,
        inline: true,
      },
      // Informações do produto
      {
        name: "🛍️ Produto",
        value: product.name,
        inline: true,
      },
      // Quantidade
      {
        name: "📦 Quantidade",
        value: `${transaction.quantity}x`,
        inline: true,
      },
      // Preço unitário
      {
        name: "💰 Preço Unitário",
        value: `${product.price} moedas`,
        inline: true,
      },
      // Preço total
      {
        name: "💵 Preço Total",
        value: `**${transaction.total_price}** moedas`,
        inline: true,
      },
      // Status da transação
      {
        name: "📊 Status",
        value: transaction.status === "completed" ? "✅ Concluída" : "⏳ Pendente",
        inline: true,
      },
      // Data da compra
      {
        name: "📅 Data da Compra",
        value: dateFormatted,
        inline: false,
      },
      // ID da transação
      {
        name: "🆔 ID da Transação",
        value: `\`${transaction._id}\``,
        inline: false,
      }
    )
    .setThumbnail(buyer.displayAvatarURL({ dynamic: true }))
    .setTimestamp();

  // Adicionar imagem do produto se disponível
  if (product.image_url) {
    embed.setImage(product.image_url);
  }

  // Adicionar descrição do produto se disponível
  if (product.description) {
    embed.addFields({
      name: "📝 Descrição do Produto",
      value: product.description,
      inline: false,
    });
  }

  // Adicionar categoria do produto
  if (product.category) {
    embed.addFields({
      name: "🏷️ Categoria",
      value: product.category,
      inline: true,
    });
  }

  // Adicionar estoque restante
  if (product.stock !== undefined) {
    embed.addFields({
      name: "📊 Estoque Restante",
      value: `${product.stock} unidades`,
      inline: true,
    });
  }

  // Enviar embed para o canal
  await channel.send({
    embeds: [embed],
  });
}
