const { cmd } = require("../command");
const { enableLinkDetection, disableLinkDetection, getLinkDetectionMode } = require("../lib/linkDetection");
const config = require("../config");

cmd({
    pattern: "antilink",
    desc: "Manage anti-link settings in a group.",
    category: "moderation",
    filename: __filename
}, async (Void, citel, mek, { isGroup, isAdmins }) => {
    if (!isGroup) return citel.reply("*This command can only be used in groups!*");
    
    // Better admin verification
    try {
        const groupMetadata = await Void.groupMetadata(citel.chat);
        const isParticipantAdmin = groupMetadata.participants.find(p => p.id === citel.sender)?.admin;
        
        if (!isParticipantAdmin && !isAdmins) {
            return citel.reply("*You must be an admin to use this command!*");
        }
    } catch (error) {
        console.error("Admin check error:", error);
        return citel.reply("*Error verifying admin status. Please try again.*");
    }

    const currentMode = getLinkDetectionMode(citel.chat) || "off";
    const mode = citel.text?.toLowerCase().split(" ")[1];

    // Button template
    const buttons = [
        { buttonId: `${config.PREFIX}antilink kick`, buttonText: { displayText: "🦶 Kick" }, type: 1 },
        { buttonId: `${config.PREFIX}antilink delete`, buttonText: { displayText: "🗑️ Delete" }, type: 1 },
        { buttonId: `${config.PREFIX}antilink warn`, buttonText: { displayText: "⚠️ Warn" }, type: 1 },
        { buttonId: `${config.PREFIX}antilink off`, buttonText: { displayText: "❌ Off" }, type: 1 }
    ];

    // If no mode specified, show menu
    if (!mode || !["kick", "delete", "warn", "off"].includes(mode)) {
        return Void.sendMessage(citel.chat, {
            text: `*🔗 Anti-Link Settings*\n\nCurrent mode: ${currentMode === "off" ? "Disabled" : currentMode}\n\nSelect action for link senders:`,
            buttons,
            footer: config.BOT_NAME,
            headerType: 1
        }, { quoted: citel });
    }

    // Process the mode
    let responseMessage;
    if (mode === "off") {
        disableLinkDetection(citel.chat);
        responseMessage = "*🔗 Anti-Link has been disabled for this group.*";
    } else {
        enableLinkDetection(citel.chat, mode);
        responseMessage = `*🔗 Anti-Link is now set to '${mode}' mode in this group.*`;
    }

    // Send confirmation with back button
    await Void.sendMessage(citel.chat, {
        text: responseMessage,
        buttons: [{ buttonId: `${config.PREFIX}antilink`, buttonText: { displayText: "🔙 Back" }, type: 1 }],
        footer: config.BOT_NAME,
        headerType: 1
    }, { quoted: citel });
});
