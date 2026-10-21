import { Client, Events, GatewayIntentBits } from 'discord.js';

// Load environment variables from .env
process.loadEnvFile();

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, readyDiscord);

// Login to Discord with your client's token
client.login(process.env.TOKEN);

function readyDiscord() {
  console.log('💖');
  let joeyChannel = client.channels.cache.get('1557412064803422278');
  joeyChannel.send('hiiiii');
}
