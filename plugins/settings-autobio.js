const { cmd } = require('../command');
const config = require('../config');
const axios = require("axios");


let bioInterval;
const defaultBio = "ᴍᴀʀɪsᴇʟ | ᴏɴʟɪɴᴇ  {timeZone}";
const timeZone = 'America/Port-au-Prince';

cmd({
    pattern: "autobio",
    alias: ["autoabout"],
    desc: "Toggle automatic bio updates",
    category: "misc",
    filename: __filename,
    usage: `${config.PREFIX}ᴀᴜᴛᴏʙɪᴏ [on/off]`
}, async (conn, mek, m, { args, reply, isOwner, isCreator }) => {
    if (!isOwner && !isCreator) return reply("❌ ᴏɴʟʏ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ");
    
   const response = await axios.get("http://api.forismatic.com/api/1.0/", {
      params: {
        method: "getQuote",
        format: "json",
        lang: "en",
      },
    });

    const { quoteText } = response.data;
    
    const [action, ...bioParts] = args;
    const customBio = quoteText;

    try {
        if (action === 'on') {
            if (config.AUTO_BIO === "true") {
                return reply("ℹ️ ᴀᴜᴛᴏ-ʙɪᴏ ɪs ᴀʟʀᴇᴀᴅʏ ᴇɴᴀʙʟᴇᴅ");
            }

            // Update config
            config.AUTO_BIO = "true";
            if (customBio) {
                // Store custom bio in memory only (not in env)
                config.AUTO_BIO_TEXT = customBio;
            } else {
                config.AUTO_BIO_TEXT = defaultBio;
            }

            // Start updating bio
            startAutoBio(conn, config.AUTO_BIO_TEXT);
            return reply(`✅ ᴀᴜᴛᴏ-ʙɪᴏ ᴇɴᴀʙʟᴇᴅ\nᴄᴜʀʀᴇɴᴛ ᴛᴇxᴛ: "${config.AUTO_BIO_TEXT}"`);

        } else if (action === 'off') {
            if (config.AUTO_BIO !== "true") {
                return reply("ℹ️ ᴀᴜᴛᴏ-ʙɪᴏ ɪs ᴀʟʀᴇᴀᴅʏ ᴅɪsᴀʙʟᴇᴅ");
            }
            
            // Update config
            config.AUTO_BIO = "false";
            
            // Stop updating bio
            stopAutoBio();
            return reply("✅ ᴀᴜᴛᴏ-ʙɪᴏ ᴅɪsᴀʙʟᴇᴅ");

        } else {
            return reply(`Usage:\n` +
                `${config.PREFIX}ᴀᴜᴛᴏʙɪᴏ ᴏɴ @quote - ᴇɴᴀʙʟᴇ ᴡɪᴛʜ ʀᴀɴᴅᴏᴍ ǫᴜᴏᴛᴇs\n` +
                `${config.PREFIX}ᴀᴜᴛᴏʙɪᴏ ᴏғғ - ᴅɪsᴀʙʟᴇ ᴀᴜᴛᴏ-ʙɪᴏ\n\n` +
                `ᴀᴠᴀɪʟᴀʙʟᴇ ᴘʟᴀᴄᴇʜᴏʟᴅᴇʀs:\n` +
                `{timeZone} - ᴄᴜʀʀᴇɴᴛ ᴛɪᴍᴇ\n` +
                `ᴄᴜʀʀᴇɴᴛ sᴛᴀᴛᴜs: ${config.AUTO_BIO === "true" ? 'ON' : 'OFF'}\n` +
                `ᴄᴜʀʀᴇɴᴛ ᴛᴇxᴛ: "${config.AUTO_BIO_TEXT || defaultBio}"`);
        }
    } catch (error) {
        console.error('Auto-bio error:', error);
        return reply("❌ Failed to update auto-bio settings");
    }
});

// Start auto-bio updates
function startAutoBio(conn, bioText) {
    stopAutoBio(); // Clear any existing interval
    
    bioInterval = setInterval(async () => {
        try {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { timeZone });
            const formattedBio = bioText.replace('{time}', timeString);
            await conn.updateProfileStatus(formattedBio);
        } catch (error) {
            console.error('Bio update error:', error);
            stopAutoBio();
        }
    }, 40000 * 86000);
}

// Stop auto-bio updates
function stopAutoBio() {
    if (bioInterval) {
        clearInterval(bioInterval);
        bioInterval = null;
    }
}

// Initialize auto-bio if enabled in config
module.exports.init = (conn) => {
    if (config.AUTO_BIO === "true") {
        const bioText = config.AUTO_BIO_TEXT || defaultBio;
        startAutoBio(conn, bioText);
    }
};
