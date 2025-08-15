const fetch = require('node-fetch');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Obtenir les infos du dépôt GitHub",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/betingrich4/Mercedes';
    const imageURL = 'https://files.catbox.moe/t6zgqv.jpg';

    try {
        const match = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("❌ ʟɪᴇɴ ɢɪᴛʜᴜʙ ɪɴᴠᴀʟɪᴅᴇ.");

        const [, username, repoName] = match;
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        if (!response.ok) throw new Error(`Erreur API GitHub : ${response.status}`);
        const repoData = await response.json();

        const botname = "ᴍᴇʀᴄᴇᴅᴇs";
        const author = repoData.owner?.login || "Inconnu";
        const repoInfo = {
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            url: repoData.html_url
        };
        const createdDate = new Date(repoData.created_at).toLocaleDateString();
        const lastUpdateDate = new Date(repoData.updated_at).toLocaleDateString();

        const caption = `*ʜᴇʟʟᴏ ,,, ᴛʜɪs ɪs ${botname}*
ғᴏʀᴋ ᴀɴᴅ ɢɪᴠᴇ ᴀ sᴛᴀʀ ᴛᴏ ᴍʏ ʀᴇᴘᴏ
┏──────────────⊷
│ *sᴛᴀʀs:* ${repoInfo.stars}
│ *ғᴏʀᴋs:* ${repoInfo.forks}
│ *ʀᴇʟᴇᴀsᴇ ᴅᴀᴛᴇ:* ${createdDate}
│ *ʟᴀsᴛ ᴜᴘᴅᴀᴛᴇ:* ${lastUpdateDate}
│ *ᴏᴡɴᴇʀ:* ${author}
│ *ʀᴇᴘᴏsɪᴛᴏʀʏ:* ${repoInfo.url}
┗──────────────⊷`;

        // Télécharger l’image distante
        const imgResponse = await fetch(imageURL);
        if (!imgResponse.ok) throw new Error("Éᴄʜᴇᴄ ᴅᴜ ᴛéʟéᴄʜᴀʀɢᴇᴍᴇɴᴛ ᴅᴇ ʟ'ɪᴍᴀɢᴇ ᴅɪsᴛᴀɴᴛᴇ");
        const imageBuffer = await imgResponse.buffer();

        await conn.sendMessage(from, {
            image: imageBuffer,
            caption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363299029326322@newsletter',
                    newsletterName: '𝖒𝖆𝖗𝖎𝖘𝖊𝖑',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("❌ Erreur commande repo:", error);
        reply(`❌ Erreur : ${error.message}`);
    }
});
