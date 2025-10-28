export default {
  name: 'kiss',
  aliases: ['smooch'],
  description: 'Kiss someone with an anime gif',
  usage: 'kiss [@user]',
  execute: async (message, args, client) => {
    try {
      const response = await fetch('https://api.waifu.pics/sfw/kiss');
      const data = await response.json();
      
      const user = message.mentions.users.first();
      const text = user 
        ? `${message.author.username} kissed ${user.username}! 💋`
        : `${message.author.username} sent a kiss! 💋`;
      
      message.channel.send(`${text}\n${data.url}`);
    } catch (error) {
      message.channel.send(`Error fetching kiss image: ${error.message}`);
    }
  }
};
