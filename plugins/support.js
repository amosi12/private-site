const config = require('../settings');
const { malvin } = require('../malvin');
const { runtime } = require('../lib/functions');

const more = String.fromCharCode(8206);
const readMore = more.repeat(100); // Compact expandable section

malvin({
    pattern: "support",
    alias: ["follow", "links"],
    desc: "Display support and follow links for MALVIN XD",
    category: "main",
    react: "📡",
    filename: __filename
}, 
async (malvin, mek, m, {
    from, reply, pushname
}) => {
    try {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const uptimeFormatted = runtime(process.uptime());

        const message = `
✨ *ᴄᴏɴɴᴇᴄᴛ ᴡɪᴛʜ ᴍᴀʀɪsᴇʟ* ${readMore}
🎥 *ʏᴏᴜᴛᴜʙᴇ ᴄʜᴀɴɴᴇʟ*  
🔗 https://youtube.com/@bmb-tech

📞 *ᴄᴏɴᴛᴀᴄᴛ ᴅᴇᴠᴇʟᴏᴘᴇʀ*  
🔗 wa.me/254790375710?text=Hi%20Bmb,%20I%20need%20support!
> *ᴍᴀᴅᴇ ʙʏ 𝙽𝙾𝚅𝙰-𝚇𝙼𝙳*  
  

        `.trim();

        await malvin.sendMessage(from, {
            image: { url: 'https://github.com/novaxmd/BMB-XMD-DATA/raw/refs/heads/main/nova%20tech.jpg' },
            caption: message,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363382023564830@newsletter',
                    newsletterName: '𝙽𝙾𝚅𝙰-𝚇𝙼𝙳',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Support Cmd Error:", e);
        reply(`⚠️ Error: ${e.message}`);
    }
});