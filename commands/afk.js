import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AFK_FILE = path.join(__dirname, '..', 'database', 'afk.json');

// Ensure database directory exists
const dbDir = path.dirname(AFK_FILE);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Load AFK data
function loadAFK() {
  try {
    if (fs.existsSync(AFK_FILE)) {
      return JSON.parse(fs.readFileSync(AFK_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading AFK data:', error);
  }
  return {};
}

// Save AFK data
function saveAFK(data) {
  try {
    fs.writeFileSync(AFK_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving AFK data:', error);
  }
}

export default {
  name: 'afk',
  aliases: ['away'],
  description: 'Set your AFK status',
  usage: 'afk [reason]',
  execute: async (message, args, client) => {
    const reason = args.join(' ') || 'AFK';
    const afkData = loadAFK();
    const userId = message.author.id;
    
    afkData[userId] = {
      reason: reason,
      time: Date.now()
    };
    
    saveAFK(afkData);
    message.channel.send(`✅ You are now AFK: **${reason}**`);
  }
};

// Export function to check AFK status
export async function checkAFK(message) {
  const afkData = loadAFK();
  const userId = message.author.id;
  
  // Remove AFK if user sends a message
  if (afkData[userId]) {
    delete afkData[userId];
    saveAFK(afkData);
    message.channel.send(`👋 Welcome back, ${message.author.username}! You are no longer AFK.`);
    return;
  }
  
  // Check if message mentions any AFK users
  message.mentions.users.forEach(user => {
    if (afkData[user.id]) {
      const timeAgo = Math.floor((Date.now() - afkData[user.id].time) / 60000);
      message.channel.send(`💤 ${user.username} is AFK: **${afkData[user.id].reason}** - ${timeAgo}m ago`);
    }
  });
  
  // Check if message is a reply to an AFK user
  if (message.reference) {
    try {
      const repliedMessage = await message.fetchReference();
      if (repliedMessage && afkData[repliedMessage.author.id]) {
        const timeAgo = Math.floor((Date.now() - afkData[repliedMessage.author.id].time) / 60000);
        message.channel.send(`💤 ${repliedMessage.author.username} is AFK: **${afkData[repliedMessage.author.id].reason}** - ${timeAgo}m ago`);
      }
    } catch (error) {
      // Silently fail if message cannot be fetched
    }
  }
}
