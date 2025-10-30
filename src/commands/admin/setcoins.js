const { ApplicationCommandOptionType } = require("discord.js");
const { getMemberStats } = require("@schemas/MemberStats");
const EconomyUtils = require("@helpers/EconomyUtils");
const LogUtils = require("@helpers/LogUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "setcoins",
  description: "definir saldo de moedas diretamente (admin)",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "<@usuário> <quantidade>",
    minArgsCount: 2,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "usuário",
        description: "usuário para definir moedas",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "quantidade",
        description: "quantidade de moedas para definir",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },

  async messageRun(message, args, data) {
    const targetUser = message.mentions.users.first();
    const amount = parseInt(args[1]);
    const response = await setCoins(message, targetUser, amount);
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const targetUser = interaction.options.getUser("usuário");
    const amount = interaction.options.getNumber("quantidade");
    const response = await setCoins(interaction, targetUser, amount);
    return interaction.followUp(response);
  },
};

async function setCoins(context, targetUser, amount) {
  try {
    if (!targetUser) {
      return {
        embeds: [EconomyUtils.createErrorEmbed("Erro", "Por favor, mencione um usuário válido.")],
      };
    }

    if (isNaN(amount) || amount < 0) {
      return {
        embeds: [EconomyUtils.createErrorEmbed("Erro", "Por favor, forneça uma quantidade válida.")],
      };
    }

    // Get balance before
    const beforeStats = await getMemberStats(context.guild.id, targetUser.id, true);
    const beforeBalance = beforeStats.coin;

    // Set new balance directly
    await beforeStats.updateOne({
      $set: { coin: amount },
    });

    // Get balance after
    const afterStats = await getMemberStats(context.guild.id, targetUser.id, true);
    const afterBalance = afterStats.coin;

    const embed = EconomyUtils.createEmbed({
      title: "💰 Saldo Definido!",
      description: `O saldo de **${targetUser.username}** foi definido para **${amount}** moedas`,
      color: EconomyUtils.createEmbed().color,
      thumbnail: targetUser.displayAvatarURL({ dynamic: true }),
      footer: {
        text: `Definido por: ${context.user?.tag || context.author?.tag} • ${new Date().toLocaleDateString("pt-BR")}`,
        iconURL: context.guild.iconURL({ dynamic: true }),
      },
    });

    embed.addFields(
      {
        name: "👤 Usuário",
        value: `${targetUser.tag} (${targetUser.id})`,
        inline: true,
      },
      {
        name: "💰 Saldo Anterior",
        value: `**${beforeBalance}** moedas`,
        inline: true,
      },
      {
        name: "💰 Novo Saldo",
        value: `**${afterBalance}** moedas`,
        inline: true,
      },
      {
        name: "🎯 Status",
        value: afterBalance === amount ? "✅ **Sucesso**" : "❌ **Falha**",
        inline: true,
      }
    );

    // Send log to the admin channel
    const logEmbed = LogUtils.createAdminLog({
      title: "💰 Definição de Moedas",
      description: `**${context.user?.tag || context.author?.tag}** definiu as moedas de **${
        targetUser.tag
      }** para **${amount}**`,
      user: targetUser,
      moderator: context.user || context.author,
      color: 0x3498db,
      fields: [
        {
          name: "💰 Saldo Anterior",
          value: `**${beforeBalance}** moedas`,
          inline: true,
        },
        {
          name: "💰 Novo Saldo",
          value: `**${afterBalance}** moedas`,
          inline: true,
        },
        {
          name: "🎯 Ação",
          value: "Definição direta de saldo",
          inline: true,
        },
        {
          name: "🕒 Data",
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: false,
        },
      ],
    });

    // Send to the admin log channel
    await LogUtils.sendLog(context.guild, "admin", logEmbed);

    return { embeds: [embed] };
  } catch (error) {
    return {
      embeds: [EconomyUtils.createErrorEmbed("Erro ao Definir Moedas", `Ocorreu um erro: ${error.message}`)],
    };
  }
}
