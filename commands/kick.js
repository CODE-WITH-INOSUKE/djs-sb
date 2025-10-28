export default {
  name: 'kick',
  aliases: ['k'],
  description: 'Kick a member from the server',
  usage: 'kick <@user> [reason]',
  execute: async (message, args, client) => {
    if (!message.guild) {
      message.channel.send('This command can only be used in a server.');
      return;
    }
    
    const member = message.mentions.members.first();
    
    if (!member) {
      message.channel.send('Please mention a user to kick.');
      return;
    }
    
    if (!message.guild.members.me.permissions.has('KickMembers')) {
      message.channel.send('I do not have permission to kick members.');
      return;
    }
    
    if (!member.kickable) {
      message.channel.send('Cannot kick this user. They may have a higher role than me.');
      return;
    }
    
    const reason = args.slice(1).join(' ') || 'No reason provided';
    
    try {
      await member.kick(reason);
      message.channel.send(`✅ Successfully kicked ${member.user.tag}\nReason: ${reason}`);
    } catch (error) {
      message.channel.send(`Failed to kick user: ${error.message}`);
    }
  }
};
