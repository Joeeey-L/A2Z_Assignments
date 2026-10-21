
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Learn about the pigeon and its commands.'),

  async execute(interaction) {
    const aboutEmbed = new EmbedBuilder()
      .setColor(0x6B7280)
      .setTitle('NYC Pigeon Hotline')
      .setDescription(
        'Your complaints are important to us. ' +
        'Unfortunately, we are pigeons.'
      )
      .addFields(
        {
          name: 'Who are we?',
          value:
            'A highly qualified urban affairs consultant ' +
            'with absolutely no human experience.'
        },
        {
          name: 'Our services',
          value:
            '`/complain` — Submit your NYC complaint\n' +
            '`/appeal` — Challenge the pigeon\n' +
            '`/wisdom` — Receive questionable advice\n' +
            '`/about` — Read this message'
        },
        {
          name: 'Our mission',
          value:
            'To make New York more understandable by judging ' +
            'everything humans do.'
        }
      )
      .setFooter({
        text: 'NYC Pigeon Hotline • No crumbs, no justice.'
      });

    await interaction.reply({
      embeds: [aboutEmbed]
    });
  }
};
