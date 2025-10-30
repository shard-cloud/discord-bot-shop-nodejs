/**
 * Economy system configuration
 * Modular and easily configurable
 */
module.exports = {
  // Wealth tier configuration
  WEALTH_TIERS: [
    {
      minCoins: 1000000,
      title: "🏰 Magnata",
      description: "Você é uma das pessoas mais ricas do servidor!",
      color: 0xffd700,
    },
    {
      minCoins: 500000,
      title: "👑 Milionário",
      description: "Você alcançou o status de elite!",
      color: 0xff6b35,
    },
    {
      minCoins: 100000,
      title: "💎 Rico",
      description: "Você tem uma boa fortuna acumulada!",
      color: 0x9b59b6,
    },
    {
      minCoins: 50000,
      title: "💰 Próspero",
      description: "Seu patrimônio está crescendo bem!",
      color: 0x3498db,
    },
    {
      minCoins: 10000,
      title: "🏦 Estável",
      description: "Você tem um bom saldo!",
      color: 0x2ecc71,
    },
    {
      minCoins: 1000,
      title: "💵 Equilibrado",
      description: "Seu saldo está em dia!",
      color: 0xf39c12,
    },
    {
      minCoins: 0,
      title: "🪙 Iniciante",
      description: "Que tal trabalhar para ganhar mais moedas?",
      color: 0xe74c3c,
    },
  ],

  // Daily streak achievements
  STREAK_ACHIEVEMENTS: [
    { days: 365, title: "🏆 **Aniversário de 1 Ano**", description: "365 dias consecutivos!" },
    { days: 100, title: "💎 **Centenário**", description: "100 dias de dedicação!" },
    { days: 50, title: "🎖️ **Veterano**", description: "50 dias de consistência!" },
    { days: 30, title: "🔥 **Mensal**", description: "Um mês completo!" },
    { days: 14, title: "💪 **Determinado**", description: "Duas semanas seguidas!" },
    { days: 7, title: "⭐ **Semanal**", description: "Uma semana completa!" },
    { days: 3, title: "🎯 **Consistente**", description: "Três dias seguidos!" },
  ],

  // Streak status configuration
  STREAK_STATUS: [
    { minDays: 365, title: "🏆 LEGENDA!", description: "Você tem uma sequência de 1 ano! Incrível!", color: 0xffd700 },
    {
      minDays: 100,
      title: "💎 MESTRE!",
      description: "Você tem uma sequência de 100 dias! Fantástico!",
      color: 0xc0c0c0,
    },
    {
      minDays: 30,
      title: "🔥 VETERANO!",
      description: "Você tem uma sequência de 30 dias! Continue assim!",
      color: 0xcd7f32,
    },
    { minDays: 7, title: "⭐ DEDICADO!", description: "Você tem uma sequência de 7 dias! Muito bem!", color: 0x00a56a },
    { minDays: 3, title: "🎯 CONSISTENTE!", description: "Você está criando uma boa sequência!", color: 0x0099ff },
    { minDays: 0, title: "🌱 INICIANTE!", description: "Começando sua jornada diária!", color: 0x00a56a },
  ],
  // Coin settings
  COINS: {
    DAILY_BASE: 100,
    DAILY_LEVEL_MULTIPLIER: 10,
    DAILY_STREAK_MULTIPLIER: 5,
    MAX_GIVE_AMOUNT: 1000000,
    STARTING_AMOUNT: 1,
  },

  // Level settings
  LEVELS: {
    XP_PER_LEVEL: (level) => level * level * 100,
    XP_GAIN: {
      MESSAGE: { min: 1, max: 20 },
      VOICE: { min: 1, max: 10 },
      COMMAND: { min: 1, max: 5 },
    },
  },

  // Wealth status settings
  WEALTH_STATUS: {
    MILIONARIO: { min: 1000000, color: 0xffd700, emoji: "🏆", title: "Milionário!" },
    RICO: { min: 100000, color: 0xc0c0c0, emoji: "💎", title: "Rico!" },
    BEM_DE_VIDA: { min: 10000, color: 0xcd7f32, emoji: "💰", title: "Bem de vida!" },
    ESTAVEL: { min: 1000, color: 0x00a56a, emoji: "💵", title: "Estável!" },
    POBRE: { min: 0, color: 0xd61a3c, emoji: "💸", title: "Pobre!" },
  },

  // Daily streak settings
  DAILY_STREAK: {
    LEGENDA: { min: 365, color: 0xffd700, emoji: "🏆", title: "LEGENDA!" },
    MESTRE: { min: 100, color: 0xc0c0c0, emoji: "💎", title: "MESTRE!" },
    VETERANO: { min: 30, color: 0xcd7f32, emoji: "🔥", title: "VETERANO!" },
    DEDICADO: { min: 7, color: 0x00a56a, emoji: "⭐", title: "DEDICADO!" },
    CONSISTENTE: { min: 3, color: 0x0099ff, emoji: "🎯", title: "CONSISTENTE!" },
    INICIANTE: { min: 1, color: 0x00a56a, emoji: "🌱", title: "INICIANTE!" },
  },

  // Achievements settings
  ACHIEVEMENTS: {
    INVENTORY: {
      COLECIONADOR_MESTRE: { min: 1000, emoji: "🏆", title: "Colecionador Mestre" },
      GRANDE_COLECIONADOR: { min: 500, emoji: "🥇", title: "Grande Colecionador" },
      COLECIONADOR: { min: 100, emoji: "🥈", title: "Colecionador" },
      INICIANTE: { min: 10, emoji: "🥉", title: "Iniciante" },
    },
    SPENDING: {
      MILIONARIO: { min: 1000000, emoji: "💰", title: "Milionário" },
      RICO: { min: 100000, emoji: "💎", title: "Rico" },
      GASTADOR: { min: 10000, emoji: "💵", title: "Gastador" },
    },
    LOYALTY: {
      COMPRADOR_VIP: { min: 50, emoji: "🛍️", title: "Comprador VIP" },
      CLIENTE_FIEL: { min: 20, emoji: "🛒", title: "Cliente Fiel" },
      CLIENTE: { min: 5, emoji: "🛍️", title: "Cliente" },
    },
  },

  // Transfer settings
  TRANSFER: {
    MEGA: {
      min: 100000,
      emoji: "🎉",
      title: "MEGA TRANSFERÊNCIA!",
      description: "Uma quantia impressionante foi transferida!",
    },
    GRANDE: {
      min: 10000,
      emoji: "💎",
      title: "Grande Transferência!",
      description: "Uma boa quantia foi adicionada!",
    },
    NORMAL: {
      min: 1000,
      emoji: "💰",
      title: "Transferência Realizada!",
      description: "Moedas foram adicionadas com sucesso!",
    },
    PEQUENA: {
      min: 0,
      emoji: "💵",
      title: "Moedas Adicionadas!",
      description: "Uma pequena quantia foi transferida.",
    },
  },

  // Ranking settings
  RANKING: {
    MEDALS: {
      1: "🥇",
      2: "🥈",
      3: "🥉",
      DEFAULT: "🔸",
    },
    TYPES: {
      COINS: { emoji: "💰", title: "Moedas", description: "Moedas Acumuladas" },
      LEVEL: { emoji: "⭐", title: "Níveis", description: "Nível de Experiência" },
      MESSAGES: { emoji: "💬", title: "Mensagens", description: "Mensagens Enviadas" },
    },
    ACHIEVEMENTS: {
      coins: {
        thresholds: [
          { min: 1000000, achievements: ["🏆 **Milionário**", "💰 **Rico**", "💎 **VIP**"] },
          { min: 100000, achievements: ["💎 **Rico**", "💰 **Bem de Vida**", "⭐ **Estável**"] },
          { min: 10000, achievements: ["💰 **Bem de Vida**", "💵 **Estável**", "🎯 **Ativo**"] },
          { min: 0, achievements: ["💵 **Estável**", "🎯 **Ativo**", "🌱 **Novato**"] },
        ],
        getValue: (member) => member.coin,
      },
      level: {
        thresholds: [
          { min: 100, achievements: ["🏆 **Mestre**", "⭐ **Experiente**", "🎯 **Ativo**"] },
          { min: 50, achievements: ["⭐ **Experiente**", "🎯 **Ativo**", "🌱 **Novato**"] },
          { min: 20, achievements: ["🎯 **Ativo**", "🌱 **Novato**", "💫 **Iniciante**"] },
          { min: 0, achievements: ["🌱 **Novato**", "💫 **Iniciante**", "✨ **Recém-chegado**"] },
        ],
        getValue: (member) => member.level || 1,
      },
      messages: {
        thresholds: [
          { min: 10000, achievements: ["🏆 **Chatter Mestre**", "💬 **Muito Ativo**", "🎯 **Ativo**"] },
          { min: 5000, achievements: ["💬 **Muito Ativo**", "🎯 **Ativo**", "🌱 **Novato**"] },
          { min: 1000, achievements: ["🎯 **Ativo**", "🌱 **Novato**", "💫 **Iniciante**"] },
          { min: 0, achievements: ["🌱 **Novato**", "💫 **Iniciante**", "✨ **Recém-chegado**"] },
        ],
        getValue: (member) => member.messages || 0,
      },
    },
  },

  // Interface settings
  UI: {
    PAGINATION: {
      ITEMS_PER_PAGE: 5,
      MAX_PAGES_SHOWN: 10,
    },
    EMBEDS: {
      COLORS: {
        SUCCESS: 0x00a56a,
        ERROR: 0xd61a3c,
        WARNING: 0xf7e919,
        INFO: 0x0099ff,
        BOT: 0x068add,
      },
      FOOTERS: {
        DEFAULT_ICON: true,
        TIMESTAMP: true,
      },
    },
    PROGRESS_BAR: {
      FILLED: "█",
      EMPTY: "░",
      LENGTH: 10,
    },
  },

  // Cooldown settings
  COOLDOWNS: {
    DAILY: 24 * 60 * 60 * 1000, // 24 hours in ms
    SHOP_INTERACTION: 30 * 1000, // 30 seconds
  },

  // Validation settings
  VALIDATION: {
    MAX_REASON_LENGTH: 500,
    MAX_PRODUCT_NAME_LENGTH: 100,
    MAX_PRODUCT_DESCRIPTION_LENGTH: 1000,
    MAX_CATEGORY_LENGTH: 50,
  },
};
