export default {
  name: 'math',
  aliases: ['calc', 'calculate'],
  description: 'Perform mathematical calculations',
  usage: 'math <expression>',
  execute: async (message, args, client) => {
    const expression = args.join(' ');
    
    if (!expression) {
      message.channel.send('Please provide a mathematical expression.');
      return;
    }
    
    try {
      // Remove any potentially dangerous characters
      const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, '');
      
      if (!sanitized) {
        message.channel.send('Invalid mathematical expression.');
        return;
      }
      
      // Evaluate the expression
      const result = eval(sanitized);
      
      message.channel.send(`📊 **Math Result**\nExpression: \`${sanitized}\`\nResult: \`${result}\``);
    } catch (error) {
      message.channel.send(`Error evaluating expression: Invalid syntax`);
    }
  }
};
