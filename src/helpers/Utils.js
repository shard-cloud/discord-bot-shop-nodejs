const { COLORS } = require("@src/data.json");
const { readdirSync, lstatSync } = require("fs");
const { join, extname } = require("path");
const permissions = require("./permissions");

module.exports = class Utils {
  /**
   * Checks if a string contains a URL
   * @param {string} text
   */
  static containsLink(text) {
    return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
      text
    );
  }

  /**
   * Checks if a string is a valid discord invite
   * @param {string} text
   */
  static containsDiscordInvite(text) {
    return /(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?p?p?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/.test(
      text
    );
  }

  /**
   * Returns a random number below a max
   * @param {number} max
   */
  static getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  /**
   * Checks if a string is a valid Hex color
   * @param {string} text
   */
  static isHex(text) {
    return /^#[0-9A-F]{6}$/i.test(text);
  }

  /**
   * Checks if a string is a valid Hex color
   * @param {string} text
   */
  static isValidColor(text) {
    if (COLORS.indexOf(text) > -1) {
      return true;
    } else return false;
  }

  /**
   * Parse command arguments that may contain quoted strings
   * @param {string} argsString - The full arguments string
   * @returns {string[]} - Array of parsed arguments
   */
  static parseQuotedArgs(argsString) {
    if (!argsString) return [];

    const result = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < argsString.length; i++) {
      const char = argsString[i];

      // Handle quotes
      if ((char === '"' || char === "'") && (i === 0 || argsString[i - 1] !== "\\")) {
        if (!inQuotes) {
          // Start of quoted string
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          // End of quoted string
          if (current.trim()) {
            result.push(current.trim());
            current = "";
          }
          inQuotes = false;
        } else {
          // Different quote inside quotes, treat as normal character
          current += char;
        }
      }
      // Handle spaces
      else if (char === " " && !inQuotes) {
        if (current.trim()) {
          result.push(current.trim());
          current = "";
        }
      }
      // Handle all other characters
      else {
        current += char;
      }
    }

    // Add the last argument if there is one
    if (current.trim()) {
      result.push(current.trim());
    }

    return result;
  }

  /**
   * Returns hour difference between two dates
   * @param {Date} dt2
   * @param {Date} dt1
   */
  static diffHours(dt2, dt1) {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  }

  /**
   * Returns remaining time in days, hours, minutes and seconds
   * @param {number} timeInSeconds
   */
  static timeformat(timeInSeconds) {
    const days = Math.floor((timeInSeconds % 31536000) / 86400);
    const hours = Math.floor((timeInSeconds % 86400) / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.round(timeInSeconds % 60);
    return (
      (days > 0 ? `${days} days, ` : "") +
      (hours > 0 ? `${hours} hours, ` : "") +
      (minutes > 0 ? `${minutes} minutes, ` : "") +
      (seconds > 0 ? `${seconds} seconds` : "")
    );
  }

  /**
   * Converts duration to milliseconds
   * @param {string} duration
   */
  static durationToMillis(duration) {
    return (
      duration
        .split(":")
        .map(Number)
        .reduce((acc, curr) => curr + acc * 60) * 1000
    );
  }

  /**
   * Returns time remaining until provided date
   * @param {Date} timeUntil
   */
  static getRemainingTime(timeUntil) {
    const seconds = Math.abs((timeUntil - new Date()) / 1000);
    const time = Utils.timeformat(seconds);
    return time;
  }

  /**
   * @param {import("discord.js").PermissionResolvable[]} perms
   */
  static parsePermissions(perms) {
    const permissionWord = `permission${perms.length > 1 ? "s" : ""}`;
    return "`" + perms.map((perm) => permissions[perm]).join(", ") + "` " + permissionWord;
  }

  /**
   * Recursively searches for a file in a directory
   * @param {string} dir
   * @param {string[]} allowedExtensions
   */
  static recursiveReadDirSync(dir, allowedExtensions = [".js"]) {
    const filePaths = [];
    const readCommands = (dir) => {
      const files = readdirSync(join(process.cwd(), dir));
      files.forEach((file) => {
        const stat = lstatSync(join(process.cwd(), dir, file));
        if (stat.isDirectory()) {
          readCommands(join(dir, file));
        } else {
          const extension = extname(file);
          if (!allowedExtensions.includes(extension)) return;
          const filePath = join(process.cwd(), dir, file);
          filePaths.push(filePath);
        }
      });
    };
    readCommands(dir);
    return filePaths;
  }

  /**
   * Formata um número usando notação compacta
   * @param {number} number
   * @returns {string}
   */
  static reduceNumber(number) {
    return Intl.NumberFormat("en", { notation: "compact" }).format(number);
  }

  /**
   * Capitaliza uma string
   * @param {string} string
   * @param {boolean} allWords - Se deve capitalizar todas as palavras ou só a primeira
   * @returns {string}
   */
  static capitalize(string, allWords = true) {
    if (!allWords) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
};
