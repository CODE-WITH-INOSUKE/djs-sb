export default {
  name: 'servericon',
  aliases: ['sicon', 'guildicon'],
  description: 'Get the server icon',
  usage: 'servericon',
  execute: async (message, args, client) => {
    if (!message.guild) {
      message.channel.send('This command can only be used in a server.');
      return;
    }
    
    const iconURL = message.guild.iconURL({ dynamic: true, size: 4096 });
    
    if (!iconURL) {
      message.channel.send('This server has no icon.');
      return;
    }
    
    message.channel.send(`**${message.guild.name}'s Icon**\n${iconURL}`);
  }
};
