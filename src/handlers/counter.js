const { getSettings } = require("@schemas/Guild");
const Utils = require("@helpers/Utils");

/**
 * Updates the counter channel for all the guildId's present in the update queue
 * @param {import('@src/structures').BotClient} client
 */
async function updateCounterChannels(client) {
  client.counterUpdateQueue.forEach(async (guildId) => {
    const guild = client.guilds.cache.get(guildId);

    if (!guild) return;

    try {
      const settings = await getSettings(guild);
      const guildMembers = await guild.members.fetch();

      const all = guild.memberCount;
      const bots = settings.data.bots;
      const members = all - bots;
      const online = guildMembers.filter(
        (member) =>
          member.presence?.status === "online" ||
          member.presence?.status === "dnd" ||
          member.presence?.status === "idle"
      ).size;

      function getChannelText(_key, text) {
        _key = _key.toUpperCase();

        const types = {
          USERS: {
            text: "Usuários",
            count: all,
          },
          MEMBERS: {
            text: "Membros",
            count: members,
          },
          BOTS: {
            text: "Bots",
            count: bots,
          },
          ONLINE: {
            text: "Membros",
            count: online,
          },
        };

        const _type = types[_key] || types["MEMBERS"];

        return `👥・${Utils.reduceNumber(_type.count)} ${Utils.capitalize(text || _type.text)}`;
      }

      for (const config of settings.counters) {
        const chId = config.channel_id;
        const vc = guild.channels.cache.get(chId);

        if (!vc) {
          settings.counters = settings.counters.filter((counter) => counter.channel_id !== chId);
          await settings.save();
          continue;
        }

        let channelName = getChannelText(config.counter_type, config.name);

        if (vc.manageable && vc.name !== channelName) {
          vc.setName(channelName).catch((err) => console.log(err));
        }

        if (config.counter_type !== "ONLINE") {
          const i = client.counterUpdateQueue.indexOf(guild.id);
          if (i > -1) client.counterUpdateQueue.splice(i, 1);
        }
      }
    } catch (ex) {
      client.logger.error(`Error updating counter channels for guildId: ${guildId}`, ex);
    }
  });
}

/**
 * Initialize guild counters at startup
 * @param {import("discord.js").Guild} guild
 * @param {Object} settings
 */
async function init(guild, settings) {
  if (settings.counters.find((doc) => ["MEMBERS", "BOTS"].includes(doc.counter_type.toUpperCase()))) {
    const stats = await guild.fetchMemberStats();
    settings.data.bots = stats[1]; // update bot count in database
    await settings.save();
  }

  // schedule for update
  if (!guild.client.counterUpdateQueue.includes(guild.id)) {
    guild.client.counterUpdateQueue.push(guild.id);
  }

  return true;
}

module.exports = { init, updateCounterChannels };
