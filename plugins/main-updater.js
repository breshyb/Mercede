const {
  cmd
} = require("../command");
const axios = require("axios");
const fs = require('fs');
const path = require('path');
const AdmZip = require("adm-zip");
const {
  setCommitHash,
  getCommitHash
} = require('../data/updateDB');
cmd({
  'pattern': "update",
  'alias': ["upgrade", "sync"],
  'react': '©️',
  'desc': "Update the bot to the latest version.",
  'category': 'misc',
  'filename': __filename
}, async (_0x4d72d0, _0x2744a1, _0x385e1c, {
  reply: _0x5f32eb,
  isOwner: _0x2bc79a
}) => {
  if (!_0x2bc79a) {
    return _0x5f32eb("This ᴄᴏᴍᴍᴀɴᴅ ɪs ᴏɴʟʏ ғᴏʀ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ.");
  }
  try {
    await _0x5f32eb("ᴄʜᴇᴄᴋɪɴɢ ғᴏʀ ᴜᴘᴅᴀᴛᴇs...");
    const {
      data: _0xd57085
    } = await axios.get('https://api.github.com/repos/betingrich4/bot/commits/main');
    const _0x2bfab6 = _0xd57085.sha;
    const _0x260da5 = await getCommitHash();
    if (_0x2bfab6 === _0x260da5) {
      return _0x5f32eb("ʙᴏᴛ ɪs ᴀʟʀᴇᴀᴅʏ ᴜᴘ-ᴛᴏ-ᴅᴀᴛᴇ!");
    }
    await _0x5f32eb("*ᴜᴘᴅᴀᴛɪɴɢ ᴡᴀɪᴛ ᴘʟᴇᴀsᴇ...*");
    const _0x3e14ea = path.join(__dirname, "latest.zip");
    const {
      data: _0x4a7c90
    } = await axios.get('https://github.com/betingrich4/bot/archive/main.zip', {
      'responseType': "arraybuffer"
    });
    fs.writeFileSync(_0x3e14ea, _0x4a7c90);
    await _0x5f32eb("📦 Extracting the latest code...");
    const _0x554d93 = path.join(__dirname, "latest");
    const _0x2c150c = new AdmZip(_0x3e14ea);
    _0x2c150c.extractAllTo(_0x554d93, true);
    await _0x5f32eb("*ʀᴇᴘʟᴀᴄɪɴɢ ғɪʟᴇs...*");
    const _0x19cff6 = path.join(_0x554d93, "bot-main");
    const _0xacbb16 = path.join(__dirname, '..');
    copyFolderSync(_0x19cff6, _0xacbb16);
    await setCommitHash(_0x2bfab6);
    fs.unlinkSync(_0x3e14ea);
    fs.rmSync(_0x554d93, {
      'recursive': true,
      'force': true
    });
    await _0x5f32eb("✅ ᴜᴘᴅᴀᴛᴇ ᴄᴏᴍᴘʟᴇᴛᴇ! ʀᴇsᴛᴀʀᴛɪɴɢ ᴛʜᴇ ʙᴏᴛ...");
    process.exit(0x0);
  } catch (_0x47257c) {
    console.error("Update error:", _0x47257c);
    return _0x5f32eb("❌ ᴜᴘᴅᴀᴛᴇ ғᴀɪʟᴇᴅ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴍᴀɴᴜᴀʟʟʏ.");
  }
});
function copyFolderSync(_0x202981, _0x28f59a) {
  if (!fs.existsSync(_0x28f59a)) {
    fs.mkdirSync(_0x28f59a, {
      'recursive': true
    });
  }
  const _0x11ba46 = fs.readdirSync(_0x202981);
  for (const _0x597290 of _0x11ba46) {
    const _0x4fad5c = path.join(_0x202981, _0x597290);
    const _0x5880ef = path.join(_0x28f59a, _0x597290);
    if (_0x597290 === 'config.js' || _0x597290 === "app.json" || _0x597290 === "package.json" || _0x597290 === "index.js") {
      console.log("Skipping " + _0x597290 + " ᴛᴏ ᴘʀᴇsᴇʀᴠᴇ custom settings.");
      continue;
    }
    if (fs.lstatSync(_0x4fad5c).isDirectory()) {
      copyFolderSync(_0x4fad5c, _0x5880ef);
    } else {
      fs.copyFileSync(_0x4fad5c, _0x5880ef);
    }
  }
}
