
import 'dotenv/config';
import { REST, Routes } from 'discord.js';

import complain from './commands/complain.js';
import appeal from './commands/appeal.js';
import wisdom from './commands/wisdom.js';
import about from './commands/about.js';

const commands = [
  complain.data.toJSON(),
  appeal.data.toJSON(),
  wisdom.data.toJSON(),
  about.data.toJSON()
];

const clientId = process.env.CLIENTID;
const serverId = process.env.SERVERID;
const token = process.env.TOKEN;

if (!clientId || !serverId || !token) {
  throw new Error(
    'Missing CLIENTID, SERVERID, or TOKEN in .env'
  );
}

const rest = new REST({ version: '10' }).setToken(token);

try {
  console.log('Registering slash commands...');

  await rest.put(
    Routes.applicationGuildCommands(clientId, serverId),
    { body: commands }
  );

  console.log('Successfully registered all slash commands!');
} catch (error) {
  console.error('Failed to register slash commands:', error);
}
