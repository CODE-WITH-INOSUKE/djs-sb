import { commands } from '../index.js';
import config from '../config.js';

export default {
  name: 'help',
  aliases: ['h', 'commands', 'cmds'],
  description: 'Shows all available commands',
  usage: 'help [command]',
  execute: async (message, args, client) => {
    if (args.length > 0) {
      // Show specific command help
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName);
      
      if (!command) {
        message.channel.send(`Command \`${commandName}\` not found.`);
        return;
      }
      
      let helpText = `**Command:** ${command.name}\n`;
      helpText += `**Description:** ${command.description}\n`;
      helpText += `**Usage:** \`${config.prefix}${command.usage}\``;
      
      if (command.aliases && command.aliases.length > 0) {
        helpText += `\n**Aliases:** ${command.aliases.map(a => `\`${a}\``).join(', ')}`;
      }
      
      message.channel.send(helpText);
    } else {
      
      let helpText = '```js\n'
      helpText += `**Available Commands** (Prefix: \`${config.prefix}\`)\n\n`;
      
      commands.forEach(command => {
        const aliasText = command.aliases && command.aliases.length > 0 
          ? ` [${command.aliases.join(', ')}]` 
          : '';
        helpText += `\`${config.prefix}${command.name}\`${aliasText} - ${command.description}\n`;
      });
      
      helpText += `\nUse \`${config.prefix}help <command>\` for detailed information.`;
      helpText += '```';
      
      message.channel.send(helpText);
    }
  }
};
