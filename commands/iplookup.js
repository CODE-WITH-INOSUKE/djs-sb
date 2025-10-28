export default {
  name: 'iplookup',
  aliases: ['ip', 'ipinfo', 'lookup'],
  description: 'Lookup information about an IP address, domain, or website',
  usage: 'iplookup <ip/domain/url>',
  execute: async (message, args, client) => {
    let query = args[0];
    
    if (!query) {
      message.channel.send('Please provide an IP address, domain, or website URL to lookup.');
      return;
    }
    
    // Remove http://, https://, and trailing slashes from URLs
    query = query.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    try {
      const response = await fetch(`http://ip-api.com/json/${query}`);
      
      if (!response.ok) {
        message.channel.send('Failed to lookup IP/domain. Please check if it is valid.');
        return;
      }
      
      const data = await response.json();
      
      if (data.status === 'fail') {
        message.channel.send(`Error: ${data.message || 'Invalid IP, domain, or URL'}`);
        return;
      }
      
      let info = `**IP Lookup Results for:** ${query}\n\n`;
      info += `**IP:** ${data.query || 'N/A'}\n`;
      info += `**City:** ${data.city || 'N/A'}\n`;
      info += `**Region:** ${data.regionName || 'N/A'} (${data.region || 'N/A'})\n`;
      info += `**Country:** ${data.country || 'N/A'} (${data.countryCode || 'N/A'})\n`;
      info += `**Timezone:** ${data.timezone || 'N/A'}\n`;
      info += `**ISP:** ${data.isp || 'N/A'}\n`;
      info += `**Organization:** ${data.org || 'N/A'}\n`;
      info += `**AS:** ${data.as || 'N/A'}\n`;
      info += `**Zip Code:** ${data.zip || 'N/A'}\n`;
      info += `**Latitude:** ${data.lat || 'N/A'}\n`;
      info += `**Longitude:** ${data.lon || 'N/A'}\n`;
      
      message.channel.send(info);
    } catch (error) {
      message.channel.send(`Error looking up IP: ${error.message}`);
    }
  }
};
