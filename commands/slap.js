export default {
  name: 'slap',
  aliases: ['hit'],
  description: 'Slap someone with an anime gif',
  usage: 'slap [@user]',
  execute: async (message, args, client) => {
    try {
      const response = await fetch('https://api.waifu.pics/sfw/slap');
      const data = await response.json();
      
      const user = message.mentions.users.first();
      const text = user 
        ? `${message.author.username} slapped ${user.username}! 👋`
        : `${message.author.username} slapped someone! 👋`;
      
      message.channel.send(`${text}\n${data.url}`);
    } catch (error) {
      message.channel.send(`Error fetching slap image: ${error.message}`);
    }
  }
};
