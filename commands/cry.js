export default {
  name: 'cry',
  aliases: ['sad'],
  description: 'Cry with an anime gif',
  usage: 'cry',
  execute: async (message, args, client) => {
    try {
      const response = await fetch('https://api.waifu.pics/sfw/cry');
      const data = await response.json();
      
      message.channel.send(`${message.author.username} is crying! 😢\n${data.url}`);
    } catch (error) {
      message.channel.send(`Error fetching cry image: ${error.message}`);
    }
  }
};
