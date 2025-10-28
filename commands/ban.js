export default {
  name: 'ban',
  aliases: ['fuckoff'],
  description: 'Ban a member from the server',
  usage: 'ban <@user> [reason]',
  execute: async (message, args, client) => {
    if (!message.guild) {
      message.channel.send('This command can only be used in a server.');
      return;
    }
    
    const member = message.mentions.members.first();
    
    if (!member) {
      message.channel.send('Please mention a user to ban.');
      return;
    }
    
    if (!message.guild.members.me.permissions.has('BanMembers')) {
      message.channel.send('I do not have permission to ban members.');
      return;
    }
    
    if (!member.bannable) {
      message.channel.send('Cannot ban this user. They may have a higher role than me.');
      return;
    }
    
    const reason = args.slice(1).join(' ') || 'No reason provided';
    
    try {
      await member.ban({ reason: reason });
      message.channel.send(`✅ Successfully banned ${member.user.tag}\nReason: ${reason}`);
    } catch (error) {
      message.channel.send(`Failed to ban user: ${error.message}`);
    }
  }
};
