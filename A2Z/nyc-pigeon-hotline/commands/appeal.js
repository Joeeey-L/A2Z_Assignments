
import { SlashCommandBuilder } from 'discord.js';

const replies = {
  food: [
    "You make a compelling argument. I will consider it while eating your fries.",
    "Food is a human right. It is also a pigeon right. Case closed.",
    "You bought the food, but I saw it first. I believe that makes me the owner."
  ],

  money: [
    "Money is just paper humans invented to stop trading bread. Very inefficient.",
    "You worry about money. I worry about whether that bagel is unattended. We have different priorities.",
    "Have you tried paying rent with a really convincing coo? No? Skill issue."
  ],

  subway: [
    "You defend the subway? Interesting. Please explain why a pigeon can cross the street faster.",
    "The subway is convenient, sure. But can it land on a statue whenever it wants?",
    "I respect your optimism. I do not respect your transportation system."
  ],

  general: [
    "Objection rejected. The court recognizes only the authority of pigeons.",
    "I would respond, but I have decided that being wrong is a human tradition.",
    "Your argument has been received, ignored, and filed under 'Things Humans Say.'",
    "Hmm. You may have a point. I will now pretend you never said that."
  ]
};

function chooseCategory(text) {
  const message = text.toLowerCase();

  if (/\b(food|pizza|bagel|fries|sandwich|eat|hungry)\b/.test(message)) {
    return 'food';
  }

  if (/\b(money|rent|price|expensive|pay|cost|dollar)\b/.test(message)) {
    return 'money';
  }

  if (/\b(subway|train|mta|metro)\b/.test(message)) {
    return 'subway';
  }

  return 'general';
}

export default {
  data: new SlashCommandBuilder()
    .setName('appeal')
    .setDescription('Argue back at the pigeon.')
    .addStringOption(option =>
      option
        .setName('argument')
        .setDescription('Why is the pigeon wrong?')
        .setRequired(true)
        .setMaxLength(300)
    ),

  async execute(interaction) {
    const argument = interaction.options.getString('argument');
    const category = chooseCategory(argument);
    const responseList = replies[category];
    const response = responseList[
      Math.floor(Math.random() * responseList.length)
    ];

    await interaction.reply({
      content:
        `APPEAL RECEIVED\n` +
        `You argued: *"${argument}"*\n\n` +
        `The pigeon responds:\n` +
        `> ***${response}***`
    });
  }
};
