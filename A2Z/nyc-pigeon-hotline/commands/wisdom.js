
import { SlashCommandBuilder } from 'discord.js';

const wisdom = [
  "Never trust a human who walks too fast. They are hiding something.",
  "If a human drops food, that is not an accident. It is destiny.",
  "The best seat in New York is the one someone just stood up from.",
  "Always look confident when stealing fries. Confidence is 90% of the crime.",
  "If you fit, you sit. This applies to benches, statues, and questionable hats.",
  "Do not chase every shiny thing. Some of them are just advertisements.",
  "A city is only as good as its unattended bagels.",
  "When life gets hard, stand on a statue and look mysterious.",
  "Never pay for a view when you can stand on a streetlight.",
  "Humans invented umbrellas but still complain about rain. Think about that."
];

export default {
  data: new SlashCommandBuilder()
    .setName('wisdom')
    .setDescription('Receive questionable wisdom from a NYC pigeon.'),

  async execute(interaction) {
    const quote = wisdom[
      Math.floor(Math.random() * wisdom.length)
    ];

    await interaction.reply({
      content:
        `PIGEON WISDOM OF THE DAY\n\n` +
        `> ***"${quote}"***\n\n` +
        `You are welcome, human.`
    });
  }
};
