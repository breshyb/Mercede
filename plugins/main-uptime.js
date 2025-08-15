const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const FormData = require("form-data");
const { cmd } = require("../command");

function formatRemainingTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let days = Math.floor(totalSeconds / (3600 * 24));
  let hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  return `*┃❍ ${days} ᴅᴀʏ(s)*\n*┃❍ ${hours} ʜᴏᴜʀ(s)*\n*┃❍ ${minutes} ᴍɪɴᴜᴛᴇ(s)*\n*┃❍ ${seconds} sᴇᴄᴏɴᴅ(s)*`;
}

cmd({
  pattern: "runtime",
  alias: ["uptime", "run"],
  react: "⏳",
  desc: "Show bot alive status and uptime",
  category: "system",
  filename: __filename
}, async (client, message, args, { reply }) => {
  try {
    const start = Date.now();
    const uptimeMs = process.uptime() * 1000;
    const uptimeFormatted = formatRemainingTime(uptimeMs);

    const status = `
*ᴍᴇʀᴄᴇᴅᴇs ʜᴀᴅ ʙᴇᴇɴ ʀᴜɴɴɪɴɢ ғᴏʀ*
*┏──────────────⊷*
${uptimeFormatted}
*┗──────────────⊷*
    `;

    await client.sendMessage(message.chat, {
      image: { url: "https://files.catbox.moe/cgj5i9.jpg" },
      caption: status.trim(),
    }, { quoted: message });
        
  } catch (err) {
    console.error("Alive Command Error:", err);
    await reply(`❌ Error: ${err.message || err}`);
  }
});
