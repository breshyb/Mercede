const config = require('../config')
const {cmd , commands} = require('../command')
cmd({
    pattern: "about",
    alias: "dev",
    react: "👑",
    desc: "get owner dec",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let about = `
*╭┈───────────────•*
*│ʜᴏʟʟᴀ ${pushname}*
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* *ᴄʀᴇᴀᴛᴇᴅ ʙʏ: ᴍᴀʀɪsᴇʟ*
*│  ◦* *ʙᴏᴛ ɴᴀᴍᴇ➠ ᴅᴏᴅɢᴇ*
*│  ◦* *ᴅᴀᴛᴇ ᴄʀᴇᴀᴛᴇᴅ➠ *
*│  ◦* *ᴄɪᴛʏ➠ ɴᴀɪʀᴏʙɪ*
*│  ◦* *ᴜɴᴅᴇʀʀᴀᴛᴇ*
*╰┈───────────────•*

`
await conn.sendMessage(from, {
    image: { url: 'https://files.catbox.moe/cgj5i9.jpg' },
    caption: about,
    contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363299029326322@newsletter', // ou ton JID actuel
            newsletterName: '𝖒𝖆𝖗𝖎𝖘𝖊𝖑',
            serverMessageId: 143
        }
    }
}, { quoted: mek })

}catch(e){
console.log(e)
reply(`${e}`)
}
})

