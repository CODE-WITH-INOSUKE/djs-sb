export default {
  name: 'clear',
  aliases: ['purge', 'clean'],
  description: "Clear bot's own messages",
  usage: 'clear <amount>',
  execute: async (message, args, client) => {
    const amount = parseInt(args[0]);
    
    if (!amount || amount < 1 || amount > 100) {
      message.channel.send('Please provide a valid amount between 1 and 100.');
      return;
    }
    
    try {
      const fetched = await message.channel.messages.fetch({ limit: 100 });
      const botMessages = fetched.filter(msg => msg.author.id === client.user.id);
      const toDelete = Array.from(botMessages.values()).slice(0, amount);
      
      let deleted = 0;
      for (const msg of toDelete) {
        await msg.delete();
        deleted++;
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      const confirmMsg = await message.channel.send(`✅ Cleared ${deleted} of your messages.`);
      setTimeout(() => confirmMsg.delete(), 3000);
    } catch (error) {
      message.channel.send(`Error clearing messages: ${error.message}`);
    }
  }
};
