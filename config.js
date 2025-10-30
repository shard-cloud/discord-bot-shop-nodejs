module.exports = {
  OWNER_IDS: ["265924655276228618"],
  SUPPORT_SERVER: "",
  MAIN_SERVER: "",

  PREFIX_COMMANDS: {
    ENABLED: true,
    DEFAULT_PREFIX: "!",
  },
  INTERACTIONS: {
    SLASH: true,
    CONTEXT: true,
    GLOBAL: true,
    TEST_GUILD_ID: "",
  },
  EMBED_COLORS: {
    BOT_EMBED: "#068ADD",
    TRANSPARENT: "#36393F",
    SUCCESS: "#00A56A",
    ERROR: "#D61A3C",
    WARNING: "#F7E919",
  },
  CACHE_SIZE: {
    GUILDS: 100,
    USERS: 10000,
    MEMBERS: 10000,
  },
  MESSAGES: {
    API_ERROR: "Erro inesperado! Tente novamente mais tarde ou contate o suporte",
  },
  AUTOMOD: {
    ENABLED: false,
    LOG_EMBED: "#36393F",
    DM_EMBED: "#36393F",
  },
  MODERATION: {
    ENABLED: false,
    EMBED_COLORS: {
      TIMEOUT: "#102027",
      UNTIMEOUT: "#4B636E",
      KICK: "#FF7961",
      SOFTBAN: "#AF4448",
      BAN: "#D32F2F",
      UNBAN: "#00C853",
      VMUTE: "#102027",
      VUNMUTE: "#4B636E",
      DEAFEN: "#102027",
      UNDEAFEN: "#4B636E",
      DISCONNECT: "RANDOM",
      MOVE: "RANDOM",
    },
  },
  PRESENCE: {
    ENABLED: false,
    STATUS: "online",
    TYPE: "WATCHING",
    MESSAGE: "{members} membros em {servers} servidores",
  },
  STATS: {
    ENABLED: false,
    XP_COOLDOWN: 5,
    DEFAULT_LVL_UP_MSG: "{member:tag}, você acabou de avançar para o **Nível {level}**",
  },
};
