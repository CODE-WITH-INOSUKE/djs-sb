export default {
  name: 'ltc',
  description: 'Get Litecoin wallet address',
  usage: 'ltc',
  execute: async (message, args, client) => {
    const ltcAddress = 'YOUR_LITECOIN_ADDRESS_HERE';
    
    message.channel.send(`\`${ltcAddress}\``);
  }
};