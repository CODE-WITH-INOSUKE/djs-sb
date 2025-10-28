export default {
  name: 'gitsearch',
  aliases: ['github', 'git', 'ghsearch'],
  description: 'Search GitHub repositories',
  usage: 'gitsearch <query>',
  execute: async (message, args, client) => {
    const query = args.join(' ');
    
    if (!query) {
      message.channel.send('Please provide a search query.');
      return;
    }
    
    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=5`
      );
      
      if (!response.ok) {
        message.channel.send('Failed to search GitHub repositories.');
        return;
      }
      
      const data = await response.json();
      
      if (data.total_count === 0) {
        message.channel.send(`No repositories found for: **${query}**`);
        return;
      }
      
      let result = `**GitHub Search Results for:** ${query}\n\n`;
      
      data.items.slice(0, 5).forEach((repo, index) => {
        result += `**${index + 1}. ${repo.full_name}**\n`;
        result += `⭐ ${repo.stargazers_count.toLocaleString()} | 🍴 ${repo.forks_count.toLocaleString()}\n`;
        result += `${repo.description || 'No description'}\n`;
        result += `${repo.html_url}\n\n`;
      });
      
      message.channel.send(result);
    } catch (error) {
      message.channel.send(`Error searching GitHub: ${error.message}`);
    }
  }
};
