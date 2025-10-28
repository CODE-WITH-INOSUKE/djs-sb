export default {
  name: 'serverinfo',
  aliases: ['si', 'server', 'guildinfo'],
  description: 'Get information about the server',
  usage: 'serverinfo',
  execute: async (message, args, client) => {
    if (!message.guild) {
      message.channel.send('This command can only be used in a server.');
      return;
    }
    
    const guild = message.guild;
    const owner = await guild.fetchOwner();
    
    let info = '```js\n';
    info +=`**Server Information**\n\n`;
    info += `**Name:** ${guild.name}\n`;
    info += `**ID:** ${guild.id}\n`;
    info += `**Owner:** ${owner.user.username}\n`;
    info += `**Created:** ${guild.createdAt.toDateString()}\n`;
    info += `**Members:** ${guild.memberCount}\n`;
    info += `**Channels:** ${guild.channels.cache.size}\n`;
    info += `**Roles:** ${guild.roles.cache.size}\n`;
    info += `**Emojis:** ${guild.emojis.cache.size}\n`;
    info += `**Boost Level:** ${guild.premiumTier || 0}\n`;
    info += `**Boost Count:** ${guild.premiumSubscriptionCount || 0}\n`;
    info += `**Verification Level:** ${guild.verificationLevel}\n`;
    info += '```';
    
    message.channel.send(info);
  }
};
