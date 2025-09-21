const { malvin } = require('../malvin');
const axios = require("axios");

function formatRemainingTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let days = Math.floor(totalSeconds / (3600 * 24));
  let hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  return `*┃❍ ${days} ᴅᴀʏ(s)*\n*┃❍ ${hours} ʜᴏᴜʀ(s)*\n*┃❍ ${minutes} ᴍɪɴᴜᴛᴇ(s)*\n*┃❍ ${seconds} sᴇᴄᴏɴᴅ(s)*`;
}

malvin({
  pattern: "runtime",
  alias: ["uptime", "run"],
  react: "⏳",
  desc: "Show bot alive status and uptime",
  category: "system",
  filename: __filename
}, async (malvin, mek, m, { from, reply, react: doReact }) => {
  try {
    const uptimeMs = process.uptime() * 1000;
    const uptimeFormatted = formatRemainingTime(uptimeMs);

    const status = `
*𝙽𝙾𝚅𝙰-𝚇𝙼𝙳 ʜᴀᴅ ʙᴇᴇɴ ʀᴜɴɴɪɴɢ ғᴏʀ*
*┏──────────────⊷*
${uptimeFormatted}
*┗──────────────⊷*
    `;

    await malvin.sendMessage(from, {
      image: { url: "https://github.com/novaxmd/BMB-XMD-DATA/raw/refs/heads/main/nova%20tech.jpg" },
      caption: status.trim(),
    }, { quoted: mek });
    
    await doReact("✅");
        
  } catch (err) {
    console.error("Runtime Command Error:", err);
    await doReact("❌");
    await reply(`❌ Error: ${err.message || err}`);
  }
});
