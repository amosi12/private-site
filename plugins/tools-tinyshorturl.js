//---------------------------------------------
//           𝗡𝗢𝗩𝗔-𝗫𝗠𝗗
//---------------------------------------------
//  ⚠️ DO NOT MODIFY THIS FILE OR REMOVE THIS CREDIT⚠️  
//---------------------------------------------

const { malvin } = require('../malvin');
const axios = require('axios');
const config = require('../settings');

/**
 * Shortens a long URL using the TinyURL API.
 * @param {Object} malvin - The bot instance.
 * @param {Object} mek - The message object.
 * @param {Object} m - Message metadata and utilities.
 * @param {Object} params - Destructured parameters (from, args, reply, quoted).
 */
malvin({
    pattern: 'tinyurl',
    alias: ['shorten', 'shorturl', 'tiny'],
    desc: 'Shorten a long URL.',
    category: 'convert',
    use: '.tinyurl <long_url>',
    filename: __filename
}, async (malvin, mek, m, { from, args, reply, quoted }) => {
    try {
        const longUrl = args.join(' ').trim();
        if (!longUrl) {
            return reply(
                '❌ *No URL provided!*\n\n' +
                'Please provide a valid URL.\n' +
                'Example: `.tinyurl https://example.com/very-long-url`'
            );
        }
        if (longUrl.length > 2000) {
            return reply('❌ *URL too long!*\n\nPlease provide a URL under 2,000 characters.');
        }
        if (!isValidUrl(longUrl)) {
            return reply(
                '❌ *Invalid URL!*\n\n' +
                'Please provide a valid URL starting with http:// or https://.\n' +
                'Example: `.tinyurl https://example.com/very-long-url`'
            );
        }

        await reply('⏳ Shortening URL...');

        const shortUrl = await shortenUrl(longUrl);
        if (!isValidUrl(shortUrl)) {
            return reply('❌ *Failed to shorten URL.*\nPlease try again later.');
        }

        const caption = `🔗 *NOVA XMD URL SHORTENER*\n\n` +
                       `🔹 *Original URL:* ${longUrl}\n` +
                       `🔹 *Shortened URL:* ${shortUrl}\n\n` +
                       `🔹 *ᴍᴀᴅᴇ ʙʏ 𝙽𝙾𝚅𝙰-𝚇𝙼𝙳*`;

        // Attempt to fetch image from config.MENU_IMAGE_URL
        const imageAvailable = config.MENU_IMAGE_URL && isValidUrl(config.MENU_IMAGE_URL);
        const messageOptions = imageAvailable ? {
            image: { url: config.MENU_IMAGE_URL },
            caption,
            contextInfo: {
                externalAdReply: {
                    title: 'URL Shortener',
                    body: 'Shortened URL',
                    thumbnail: await axios.get(config.MENU_IMAGE_URL, { responseType: 'arraybuffer' })
                        .then(res => res.data)
                        .catch(() => null),
                    mediaType: 2
                }
            }
        } : { text: caption };

        await malvin.sendMessage(from, messageOptions, { quoted });

        // Send clean URL after 2-second delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        await reply(shortUrl);

    } catch (error) {
        console.error('TinyURL error:', error);
        if (error.response?.status === 429) {
            return reply('❌ *Rate limit exceeded!*\nPlease try again later.');
        } else if (error.response?.status >= 500) {
            return reply('❌ *API server unavailable!*\nPlease try again later.');
        }
        return reply(`❌ *Failed to shorten URL.*\nError: ${error.message || 'Unknown error. Please try again.'}`);
    }
});

// ---------------------
// Helper Functions
// ---------------------

/**
 * Validates if a URL is properly formatted.
 * @param {string} url - The URL to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function isValidUrl(url) {
    const regex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return regex.test(url);
}

/**
 * Shortens a URL using the TinyURL API.
 * @param {string} longUrl - The URL to shorten.
 * @returns {Promise<string>} - The shortened URL.
 */
async function shortenUrl(longUrl) {
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`, {
        timeout: 5000 // 5-second timeout
    });
    return response.data;
}

// Code by Malvin King