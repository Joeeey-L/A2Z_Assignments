
import { SlashCommandBuilder } from 'discord.js';

// 1. Extract a topic and classify the complaint.
const keywordRules = [
  {
    category: 'subway',
    keywords: [
      { pattern: /\b(subway|subways)\b/i, topic: 'the subway' },
      { pattern: /\b(mta)\b/i, topic: 'the MTA' },
      { pattern: /\b(trains?|metro)\b/i, topic: 'the train system' }
    ]
  },
  {
    category: 'weather',
    keywords: [
      { pattern: /\b(rain|raining|rainy)\b/i, topic: 'the rain' },
      { pattern: /\b(snow|snowing|snowy)\b/i, topic: 'the snow' },
      { pattern: /\b(cold|freezing|chilly)\b/i, topic: 'the cold' },
      { pattern: /\b(hot|heat|humid)\b/i, topic: 'the heat' },
      { pattern: /\b(weather)\b/i, topic: 'the weather' }
    ]
  },
  {
    category: 'rent',
    keywords: [
      { pattern: /\b(landlord|landlords)\b/i, topic: 'your landlord' },
      { pattern: /\b(rent)\b/i, topic: 'your rent' },
      { pattern: /\b(apartment|apartments|housing)\b/i, topic: 'your apartment' }
    ]
  },
  {
    category: 'tourists',
    keywords: [
      { pattern: /\b(tourist|tourists)\b/i, topic: 'tourists' },
      { pattern: /\b(times square)\b/i, topic: 'Times Square' },
      { pattern: /\b(sidewalk|sidewalks)\b/i, topic: 'the sidewalk' },
      { pattern: /\b(crowded|crowds|crowd)\b/i, topic: 'the crowds' }
    ]
  },
  {
    category: 'food',
    keywords: [
      { pattern: /\b(bagel|bagels)\b/i, topic: 'bagels' },
      { pattern: /\b(pizza)\b/i, topic: 'pizza' },
      { pattern: /\b(fries|french fries)\b/i, topic: 'fries' },
      { pattern: /\b(sandwich|sandwiches)\b/i, topic: 'sandwiches' },
      { pattern: /\b(food|hungry|restaurant|restaurants)\b/i, topic: 'food' }
    ]
  }
];

// 2. Find the first matching keyword.
function analyzeComplaint(text) {
  for (const rule of keywordRules) {
    for (const item of rule.keywords) {
      if (item.pattern.test(text)) {
        return {
          category: rule.category,
          topic: item.topic
        };
      }
    }
  }

  return {
    category: 'other',
    topic: 'this human problem'
  };
}

// 3. Store reusable sentence parts for each category.
const templates = {
  subway: {
    openings: [
      'Ah, another human transportation crisis.',
      'The daily subway tragedy continues.',
      'Fascinating. Humans are struggling again.'
    ],
    observations: [
      topic => `You trust ${topic} to get you places`,
      topic => `You depend on ${topic} and expect everything to work`,
      topic => `You complain about ${topic} instead of growing wings`
    ],
    endings: [
      "and somehow I'M the unreliable one.",
      'while I travel for free with perfectly good wings.',
      'but somehow pigeons are considered the problem.'
    ]
  },

  weather: {
    openings: [
      'Ah, another atmospheric emergency.',
      'The sky has personally offended a human again.',
      'Breaking news from the Department of Feathers.'
    ],
    observations: [
      topic => `You complain about ${topic} while I live outside`,
      topic => `You act surprised when ${topic} happens outdoors`,
      topic => `You expect the city to function perfectly during ${topic}`
    ],
    endings: [
      'I wear a feather jacket every day. No complaints.',
      'Have you tried being a little more bird-shaped?',
      'Perhaps the problem is your lack of feathers.'
    ]
  },

  rent: {
    openings: [
      'Ah, the human financial crisis.',
      'Let me consult my extremely comfortable statue.',
      'Another day, another questionable human decision.'
    ],
    observations: [
      topic => `You let ${topic} control your entire existence`,
      topic => `You worry about ${topic} while I live on public property`,
      topic => `You humans have made ${topic} unnecessarily complicated`
    ],
    endings: [
      'My rent is ZERO.',
      'And you call ME bad at surviving.',
      'Have you considered becoming a pigeon?'
    ]
  },

  tourists: {
    openings: [
      'Ah, a public-space emergency.',
      'The sidewalk drama continues.',
      'As a respected local resident, I must comment.'
    ],
    observations: [
      topic => `You let ${topic} block the way`,
      topic => `You humans cannot navigate ${topic} without stopping`,
      topic => `You complain about ${topic} while standing in everyone's way`
    ],
    endings: [
      'I have places to be and crumbs to inspect.',
      'At least I know how to move in a straight line.',
      'This city needs more pigeons and fewer walking obstacles.'
    ]
  },

  food: {
    openings: [
      'Ah, now we are discussing something important.',
      'Finally, a subject worthy of my attention.',
      'Please continue. I am listening with my stomach.'
    ],
    observations: [
      topic => `You have ${topic} and somehow forgot to share`,
      topic => `You spend money on ${topic} but ignore the crumbs`,
      topic => `You treat ${topic} like private property`
    ],
    endings: [
      'This city has lost its values.',
      'I will be accepting samples as compensation.',
      'Sharing is caring. Especially when I get the bigger half.'
    ]
  },

  other: {
    openings: [
      'Ah, another human emergency.',
      'I see. The humans are struggling again.',
      'This is why I avoid getting involved with humans.'
    ],
    observations: [
      topic => `You have somehow turned ${topic} into a crisis`,
      topic => `You expect a pigeon to solve ${topic}`,
      topic => `You make ${topic} sound like a full-time job`
    ],
    endings: [
      'I will accept payment in bagels.',
      'Unfortunately, my shift ends at sunset.',
      'I have decided this is a human problem.'
    ]
  }
};

// 4. Randomly select one sentence part.
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// 5. Generate a new response by combining three parts.
function generateResponse(category, topic) {
  const template = templates[category] || templates.other;

  const opening = pickRandom(template.openings);
  const observation = pickRandom(template.observations)(topic);
  const ending = pickRandom(template.endings);

  return `${opening} ${observation}, ${ending}`;
}

export default {
  data: new SlashCommandBuilder()
    .setName('complain')
    .setDescription('Complain about NYC life to a judgmental pigeon.')
    .addStringOption(option =>
      option
        .setName('complaint')
        .setDescription('What is bothering you about NYC?')
        .setRequired(true)
        .setMaxLength(300)
    ),

  async execute(interaction) {
    const complaint = interaction.options.getString('complaint', true);

    const { category, topic } = analyzeComplaint(complaint);
    const response = generateResponse(category, topic);
    await interaction.reply({
      content:
        // `**NYC Pigeon Hotline**\n` +
        `Filed under: ${category.toUpperCase()}\n` +
        `COMPLAINT RECEIVED. Human judgment pending.\n\n` +
        `> ***${response}***`
    });
  }
};

// import { SlashCommandBuilder } from 'discord.js';

// const responses = {
//   subway: [
//     "You humans built an underground maze, put metal boxes in it, and are surprised when they don't move. Fascinating.",
//     "Another subway delay? Have you tried growing wings? I highly recommend it.",
//     "The MTA stands for Mostly Terrible Adventures. Even I know that, and I eat things off the sidewalk."
//   ],

//   weather: [
//     "It's raining and you're complaining? I live outside in a feather jacket. Skill issue.",
//     "Humans invented weather apps and still dress incorrectly. Incredible.",
//     "A little snow never stopped a pigeon. Have you tried being covered in feathers?"
//   ],

//   rent: [
//     "You PAY to live indoors? I sleep on a statue for free. We are not the same.",
//     "Your landlord charges you for a room? I have occupied six buildings this morning without signing anything.",
//     "Rent is due again? Simply become a pigeon. Financial freedom awaits."
//   ],

//   tourists: [
//     "Tourists stop in the middle of the sidewalk to take photos. I stop in the middle of the sidewalk to exist. Know the difference.",
//     "Times Square is full of people staring at giant screens. Have humans discovered puddles yet?",
//     "Another tourist blocking the sidewalk? I recommend a gentle wing slap. Legally, I was never here."
//   ],

//   food: [
//     "You bought a bagel and DIDN'T share? This city has lost its values.",
//     "You paid twelve dollars for a sandwich and left crumbs behind. Finally, a sensible financial decision.",
//     "Pizza is for sharing. Especially sharing with me. Mostly sharing with me."
//   ],

//   other: [
//     "Interesting complaint. Have you considered that the problem is simply being human?",
//     "I hear you. Unfortunately, I have a bread-related emergency and cannot care right now.",
//     "That sounds difficult. I once fought a pigeon over half a pretzel. We all have our struggles."
//   ]
// };

// function getCategory(text) {
//   const message = text.toLowerCase();

//   if (/\b(subway|train|mta|metro)\b/.test(message)) {
//     return 'subway';
//   }

//   if (/\b(weather|rain|raining|cold|hot|snow|snowing)\b/.test(message)) {
//     return 'weather';
//   }

//   if (/\b(rent|landlord|apartment|housing)\b/.test(message)) {
//     return 'rent';
//   }

//   if (/\b(tourist|tourists|times square|sidewalk|crowded)\b/.test(message)) {
//     return 'tourists';
//   }

//   if (/\b(food|pizza|bagel|fries|sandwich|hungry|restaurant)\b/.test(message)) {
//     return 'food';
//   }

//   return 'other';
// }

// function pickRandom(list) {
//   return list[Math.floor(Math.random() * list.length)];
// }

// export default {
//   data: new SlashCommandBuilder()
//     .setName('complain')
//     .setDescription('Complain about life in NYC to a judgmental pigeon.')
//     .addStringOption(option =>
//       option
//         .setName('complaint')
//         .setDescription('What is bothering you about NYC?')
//         .setRequired(true)
//         .setMaxLength(300)
//     ),

//   async execute(interaction) {
//     const complaint = interaction.options.getString('complaint');
//     const category = getCategory(complaint);
//     const response = pickRandom(responses[category]);

//     await interaction.reply({
//       content:
//         // `**NYC Pigeon Hotline**\n` +
//         `Filed under: ${category.toUpperCase()}\n` +
//         `COMPLAINT RECEIVED. Human judgment pending.\n\n` +
//         `> ***${response}***`
//     });
//   }
// };
