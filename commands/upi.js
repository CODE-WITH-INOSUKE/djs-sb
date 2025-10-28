import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPI_QR_PATH = path.join(__dirname, '..', 'database', 'upiqr.png');

export default {
  name: 'upi',
  aliases: ['upiqr', 'payment'],
  description: 'Send UPI QR code',
  usage: 'upi',
  execute: async (message, args, client) => {
    if (!fs.existsSync(UPI_QR_PATH)) {
      message.channel.send('❌ UPI QR code not found. Please place `upiqr.png` in the `database` folder.');
      return;
    }
    
    try {
      await message.channel.send({
        content: '**UPI Payment QR Code:**',
        files: [UPI_QR_PATH]
      });
    } catch (error) {
      message.channel.send(`Error sending UPI QR: ${error.message}`);
    }
  }
};
