export default {
  name: 'happy',
  aliases: ['smile', 'joy'],
  description: 'Show happiness with an anime gif',
  usage: 'happy',
  execute: async (message, args, client) => {
    try {
      const response = await fetch('https://api.waifu.pics/sfw/happy');
      const data = await response.json();
      
      message.channel.send(`${message.author.username} is happy! 😊\n${data.url}`);
    } catch (error) {
      message.channel.send(`Error fetching happy image: ${error.message}`);
    }
  }
};
