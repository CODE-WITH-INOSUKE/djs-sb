export default {
  name: 'spam',
  aliases: ['repeat'],
  description: 'Spam a message multiple times',
  usage: 'spam <amount> <message>',
  execute: async (message, args, client) => {
    const amount = parseInt(args[0]);
    
    if (!amount || amount < 1 || amount > 20) {
      message.channel.send('Please provide a valid amount between 1 and 20.');
      return;
    }
    
    const text = args.slice(1).join(' ');
    
    if (!text) {
      message.channel.send('Please provide a message to spam.');
      return;
    }
    
    try {
      for (let i = 0; i < amount; i++) {
        message.channel.send(text);
      }
    } catch (error) {
      message.channel.send(`Error spamming: ${error.message}`);
    }
  }
};
