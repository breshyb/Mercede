const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');

// Fonction pour styliser les majuscules comme ʜɪ
function toUpperStylized(str) {
  const stylized = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.split('').map(c => stylized[c.toUpperCase()] || c).join('');
}

// Normalisation des catégories
const normalize = (str) => str.toLowerCase().replace(/\s+menu$/, '').trim();

// Emojis par catégorie normalisée
const emojiByCategory = {
  ai: '🤖',
  anime: '🍥',
  audio: '🎧',
  bible: '📖',
  download: '⬇️',
  downloader: '📥',
  fun: '🎮',
  game: '🕹️',
  group: '👥',
  img_edit: '🖌️',
  info: 'ℹ️',
  information: '🧠',
  logo: '🖼️',
  main: '🏠',
  media: '🎞️',
  menu: '📜',
  misc: '📦',
  music: '🎵',
  other: '📁',
  owner: '👑',
  privacy: '🔒',
  search: '🔎',
  settings: '⚙️',
  sticker: '🌟',
  tools: '🛠️',
  user: '👤',
  utilities: '🧰',
  utility: '🧮',
  wallpapers: '🖼️',
  whatsapp: '📱',
};

cmd({
  pattern: "menu",
  alias: ["dck", "ma", "allmenu"],
  use: '.menu',
  desc: "Show all bot commands",
  category: "menu",
  react: "🖐️",
  filename: __filename
},
async (dyby, mek, m, { from, reply }) => {
  try {
    const sender = m?.sender || mek?.key?.participant || mek?.key?.remoteJid || 'unknown@s.whatsapp.net';
    const totalCommands = commands.length;

    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    let dybymenu = `
*┏────〘 ᴍᴇʀᴄᴇᴅᴇs 〙───⊷*
*┃* ᴜꜱᴇʀ : @${sender.split("@")[0]}
*┃* ʀᴜɴᴛɪᴍᴇ : ${uptime()}
*┃* ᴍᴏᴅᴇ : *${config.MODE}*
*┃* ᴘʀᴇғɪx : 「 ${config.PREFIX} 」
*┃* ᴏᴡɴᴇʀ : ${config.OWNER_NAME}
*┃* ᴘʟᴜɢɪɴꜱ : 『 ${totalCommands} 』
*┃* ᴅᴇᴠ : ᴍᴀʀɪsᴇʟ
*┃* ᴠᴇʀꜱɪᴏɴ : 2.0.0
*┗──────────────⊷*`;

    // Regrouper les commandes par catégorie normalisée
    let categories = {};
    for (let cmd of commands) {
      if (!cmd.category) continue;
      const cat = normalize(cmd.category);
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd);
    }

    // Construction du menu par catégorie
    const sortedKeys = Object.keys(categories).sort();
    for (let key of sortedKeys) {
      const emoji = emojiByCategory[key] || '💫';
      dybymenu += `\n\n┏─『 ${emoji} *${toUpperStylized(key)} ᴍᴇɴᴜ* 』──⊷`;

      const cmds = categories[key].filter(c => c.pattern).sort((a, b) => a.pattern.localeCompare(b.pattern));
      for (let c of cmds) {
        const usage = c.pattern.split('|')[0];
        dybymenu += `\n┊ ${config.PREFIX}${toUpperStylized(usage)}`;
      }
      dybymenu += `\n┗──────────────⊷`;
    }

    // Envoi du menu avec image
    await dyby.sendMessage(from, {
      image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/roubzi.jpg' },
      caption: dybymenu,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363299029326322@newsletter',
          newsletterName: '𝖒𝖆𝖗𝖎𝖘𝖊𝖑',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error("❌ Error in menu:", e);
    reply(`❌ Menu error: ${e.message}`);
  }
});
