
import {
  Client,
  Events,
  GatewayIntentBits,
  Collection
} from 'discord.js';

import complain from './commands/complain.js';
import appeal from './commands/appeal.js';
import wisdom from './commands/wisdom.js';
import about from './commands/about.js';

process.loadEnvFile();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

const commands = [
  complain,
  appeal,
  wisdom,
  about
];

for (const command of commands) {
  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
  console.log(`Loaded ${client.commands.size} commands.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`Command not found: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(
      `Error executing /${interaction.commandName}:`,
      error
    );

    const errorMessage = {
      content: '🐦 The pigeon flew into a wall. Please try again.',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

client.login(process.env.TOKEN);
