export const LEVELS = {
  easy: {
    name: "Easy",
    points: 10,
    maxAttempts: 8,
    description: "Warm-up round with generous hints.",
  },
  medium: {
    name: "Medium",
    points: 20,
    maxAttempts: 6,
    description: "A balanced challenge for everyday players.",
  },
  hard: {
    name: "Hard",
    points: 35,
    maxAttempts: 5,
    description: "Tougher clues, fewer chances, bigger reward.",
  },
};

export const GAMES = [
  {
    id: "number-quest",
    title: "Number Quest",
    subtitle: "Find the hidden number before your attempts run out.",
    image: "/images/number-crystal.svg",
    tags: ["Logic", "Math", "Hints"],
    inputPlaceholder: "Type a number...",
    inputType: "number",
  },
  {
    id: "word-garden",
    title: "Word Garden",
    subtitle: "Guess the secret word using clue petals.",
    image: "/images/word-forest.svg",
    tags: ["Words", "Vocabulary", "Clues"],
    inputPlaceholder: "Type the secret word...",
    inputType: "text",
  },
  {
    id: "emoji-orbit",
    title: "Emoji Orbit",
    subtitle: "Decode the emoji riddle and name the answer.",
    image: "/images/emoji-planet.svg",
    tags: ["Riddles", "Creative", "Fun"],
    inputPlaceholder: "Type your answer...",
    inputType: "text",
  },
];

const wordBank = {
  easy: [
    { answer: "apple", category: "Fruit", clues: ["It can be red, green, or yellow.", "Teachers are often connected with it in cartoons.", "It starts with A."] },
    { answer: "river", category: "Nature", clues: ["It moves across land.", "Boats can travel on it.", "It starts with R."] },
    { answer: "pencil", category: "School", clues: ["It helps you write.", "It often has an eraser.", "It starts with P."] },
  ],
  medium: [
    { answer: "planet", category: "Space", clues: ["It travels around a star.", "Earth is one of these.", "It starts with P."] },
    { answer: "lantern", category: "Object", clues: ["It helps you see in the dark.", "Campers may carry it.", "It starts with L."] },
    { answer: "castle", category: "Place", clues: ["Kings and queens may live there.", "It can have towers.", "It starts with C."] },
  ],
  hard: [
    { answer: "compass", category: "Tool", clues: ["Explorers use it.", "It points direction.", "It starts with C."] },
    { answer: "volcano", category: "Geography", clues: ["It can sleep for years.", "It may release lava.", "It starts with V."] },
    { answer: "thunder", category: "Weather", clues: ["You hear it during storms.", "It follows lightning.", "It starts with T."] },
  ],
};

const emojiBank = {
  easy: [
    { answer: "pizza", display: "🍞🧀🍅🔥", clues: ["It is a popular fast food.", "It is usually sliced into triangles.", "It starts with P."] },
    { answer: "rainbow", display: "🌧️☀️🌈", clues: ["It appears after rain and sun.", "It has many colors.", "It starts with R."] },
    { answer: "birthday", display: "🎂🎈🎁", clues: ["It happens once a year.", "People often celebrate with cake.", "It starts with B."] },
  ],
  medium: [
    { answer: "airport", display: "🧳✈️🛫", clues: ["Travelers go here.", "Planes arrive and leave from it.", "It starts with A."] },
    { answer: "campfire", display: "🏕️🪵🔥", clues: ["You may sit around it at night.", "It gives warmth outdoors.", "It starts with C."] },
    { answer: "treasure", display: "🗺️❌💎", clues: ["Pirates search for it.", "It is often hidden.", "It starts with T."] },
  ],
  hard: [
    { answer: "time travel", display: "⏰🚪🌌", clues: ["Science-fiction stories love this idea.", "It means moving through the past or future.", "Two words: T + T."] },
    { answer: "detective", display: "🔍🕵️‍♂️📄", clues: ["This person solves mysteries.", "Clues are important to their work.", "It starts with D."] },
    { answer: "submarine", display: "🌊🚢⬇️", clues: ["It travels below the sea.", "It is a type of vessel.", "It starts with S."] },
  ],
};

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function scramble(word) {
  return word
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

export function createRound(gameId, levelKey) {
  const level = LEVELS[levelKey] || LEVELS.easy;

  if (gameId === "number-quest") {
    const ranges = { easy: 20, medium: 50, hard: 100 };
    const max = ranges[levelKey] || 20;
    const answer = Math.floor(Math.random() * max) + 1;
    return {
      gameId,
      levelKey,
      answer: String(answer),
      display: `1 - ${max}`,
      prompt: `Guess a number between 1 and ${max}.`,
      category: "Number",
      maxAttempts: level.maxAttempts,
      hints: [`The number is ${answer % 2 === 0 ? "even" : "odd"}.`, `It is ${answer > max / 2 ? "above" : "below"} the middle of the range.`, `It is within ${Math.max(1, answer - 5)} and ${Math.min(max, answer + 5)}.`],
    };
  }

  if (gameId === "word-garden") {
    const item = randomItem(wordBank[levelKey] || wordBank.easy);
    return {
      gameId,
      levelKey,
      answer: item.answer,
      display: "_ ".repeat(item.answer.length).trim(),
      prompt: "Guess the hidden word.",
      category: item.category,
      maxAttempts: level.maxAttempts,
      hints: [`Category: ${item.category}.`, `Length: ${item.answer.length} letters.`, ...item.clues, `Scrambled: ${scramble(item.answer)}.`],
    };
  }

  const item = randomItem(emojiBank[levelKey] || emojiBank.easy);
  return {
    gameId,
    levelKey,
    answer: item.answer,
    display: item.display,
    prompt: "Decode the emoji riddle.",
    category: "Emoji Riddle",
    maxAttempts: level.maxAttempts,
    hints: item.clues,
  };
}

export function normalizeGuess(value) {
  return String(value || "").trim().toLowerCase();
}
