import { Client } from 'discord.js-selfbot-v13';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import config from './config.js';
import { checkAFK } from './commands/afk.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client();
export const commands = new Map();
export const aliases = new Map();

// Load commands from commands folder
const commandFiles = readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.set(command.default.name, command.default);
  console.log(`Loaded command: ${command.default.name}`);
  
  // Register aliases
  if (command.default.aliases && Array.isArray(command.default.aliases)) {
    command.default.aliases.forEach(alias => {
      aliases.set(alias, command.default);
    });
  }
}

client.on('ready', () => {
  console.log(`${client.user.username} is ready!`);
  console.log(`Loaded ${commands.size} commands`);
});

client.on('messageCreate', async (message) => {
  // Ignore messages not from allowed users for commands
  if (!config.allowedUsers.includes(message.author.id)) return;
  
  // Check if message starts with prefix
  if (!message.content.startsWith(config.prefix)) {
    // Only check AFK if it's not a command
    checkAFK(message);
    return;
  }
  
  // Parse command and arguments
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  
  // Get command from map (check both commands and aliases)
  const command = commands.get(commandName) || aliases.get(commandName);
  
  if (!command) {
    // Check AFK if command not found
    checkAFK(message);
    return;
  }
  
  // Delete the command message silently
  try {
    await message.delete();
  } catch (error) {
    // Silently ignore deletion errors
  }
  
  // Skip AFK check if user is running the afk command
  if (commandName !== 'afk' && commandName !== 'away') {
    checkAFK(message);
  }
  
  try {
    await command.execute(message, args, client);
  } catch (error) {
    // Silently ignore command execution errors
  }
});

client.login(config.token);
