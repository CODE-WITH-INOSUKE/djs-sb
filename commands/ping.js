export default {
  name: 'ping',
  aliases: ['pong', 'latency'],
  description: 'Check bot latency',
  usage: 'ping',
  execute: async (message, args, client) => {
    try {
      const startTime = Date.now();
      const sent = await message.channel.send('🏓 Pinging...');
      const endTime = Date.now();
      
      const latency = endTime - startTime;
      const apiLatency = Math.round(client.ws.ping);
      
      // Add delay before editing to avoid rate limit
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await sent.edit(`🏓 Pong!\nLatency: ${latency}ms\nAPI Latency: ${apiLatency}ms`);
    } catch (error) {
      // Fallback if editing fails
      try {
        const apiLatency = Math.round(client.ws.ping);
        message.channel.send(`🏓 Pong!\nAPI Latency: ${apiLatency}ms`);
      } catch (e) {
        console.error('Ping command failed:', e);
      }
    }
  }
};
