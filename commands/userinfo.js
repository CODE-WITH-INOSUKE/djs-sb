export default {
  name: 'userinfo',
  aliases: ['ui', 'whois', 'user'],
  description: 'Get information about a user',
  usage: 'userinfo [@user]',
  execute: async (message, args, client) => {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild?.members.cache.get(user.id);
    
    let info = `**User Information**\n`;
    info += `**Username:** ${user.tag}\n`;
    info += `**ID:** ${user.id}\n`;
    info += `**Account Created:** ${user.createdAt.toDateString()}\n`;
    
    if (member) {
      info += `**Joined Server:** ${member.joinedAt.toDateString()}\n`;
      info += `**Roles:** ${member.roles.cache.map(r => r.name).join(', ')}`;
    }
    
    message.channel.send(info);
  }
};
