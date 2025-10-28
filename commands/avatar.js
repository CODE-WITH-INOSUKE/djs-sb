export default {
  name: 'avatar',
  aliases: ['av', 'pfp', 'icon'],
  description: 'Get avatar of a user',
  usage: 'avatar [@user]',
  execute: async (message, args, client) => {
    const user = message.mentions.users.first() || message.author;
    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 4096 });
    
    message.channel.send(`**${user.tag}'s Avatar**\n${avatarURL}`);
  }
};
