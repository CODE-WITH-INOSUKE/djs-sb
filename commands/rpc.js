import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, '..', 'database');
const CONFIG_FILE = path.join(CONFIG_PATH, 'rpcConfig.json');

const defaultConfig = {
  enabled: false,
  type: null,
  name: null,
  imageUrl: null
};

const VALID_TYPES = ['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING'];

const ACTIVITY_TYPES = {
  'PLAYING': 0,
  'STREAMING': 1,
  'LISTENING': 2,
  'WATCHING': 3
};

// Ensure config directory exists
if (!fs.existsSync(CONFIG_PATH)) {
  fs.mkdirSync(CONFIG_PATH, { recursive: true });
}

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading RPC config:', error);
  }
  return { ...defaultConfig };
}

function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error saving RPC config:', error);
  }
}

async function setRichPresence(client, config) {
  try {
    if (!config.enabled || !config.type || !config.name) {
      await client.user.setActivity(null);
      return;
    }

    const activity = {
      name: config.name,
      type: ACTIVITY_TYPES[config.type],
      url: config.type === 'STREAMING' ? 'https://twitch.tv/discord' : undefined
    };

    if (config.imageUrl) {
      activity.assets = {
        large_image: config.imageUrl,
        large_text: config.name
      };
    }

    await client.user.setActivity(activity);
  } catch (error) {
    console.error('[RPC] Error setting presence:', error);
    throw error;
  }
}

export default {
  name: 'rpc',
  aliases: ['presence', 'status'],
  description: 'Manage Rich Presence status',
  usage: 'rpc <on|off|set> [type] [name] [imageUrl]',
  execute: async (message, args, client) => {
    const action = args[0]?.toLowerCase();
    
    if (!action || !['on', 'off', 'set'].includes(action)) {
      message.channel.send(`**RPC Commands:**\n\`rpc on\` - Enable RPC\n\`rpc off\` - Disable RPC\n\`rpc set <type> <name> [imageUrl]\` - Set RPC\n\n**Valid types:** ${VALID_TYPES.join(', ')}`);
      return;
    }
    
    const config = loadConfig();
    
    if (action === 'off') {
      config.enabled = false;
      saveConfig(config);
      await setRichPresence(client, config);
      message.channel.send('✅ RPC disabled.');
      return;
    }
    
    if (action === 'on') {
      if (!config.type || !config.name) {
        message.channel.send('❌ No RPC configured. Use `rpc set` first.');
        return;
      }
      config.enabled = true;
      saveConfig(config);
      await setRichPresence(client, config);
      message.channel.send(`✅ RPC enabled: ${config.type} ${config.name}`);
      return;
    }
    
    if (action === 'set') {
      const type = args[1]?.toUpperCase();
      const name = args.slice(2, args.length - (args[args.length - 1]?.startsWith('http') ? 1 : 0)).join(' ');
      const imageUrl = args[args.length - 1]?.startsWith('http') ? args[args.length - 1] : null;
      
      if (!type || !VALID_TYPES.includes(type)) {
        message.channel.send(`❌ Invalid type. Valid types: ${VALID_TYPES.join(', ')}`);
        return;
      }
      
      if (!name) {
        message.channel.send('❌ Please provide a name for the activity.');
        return;
      }
      
      config.type = type;
      config.name = name;
      config.imageUrl = imageUrl;
      config.enabled = true;
      
      saveConfig(config);
      await setRichPresence(client, config);
      
      message.channel.send(`✅ RPC set: **${type}** ${name}${imageUrl ? '\n🖼️ Image: ' + imageUrl : ''}`);
    }
  }
};
