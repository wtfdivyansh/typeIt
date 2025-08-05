import {
  analyzeCharacterStats,
  getMostProblematicCharacters,
  getBestPerformingCharacters,
} from "./character-stats";

// Example usage of the character stats function
export function exampleUsage() {
  // Sample data from a typing test
  const actualWords = ["hello", "world", "typing", "test"];
  const typedWords = [
    { word: "hello", timeStamp: 1000, wpm: 60 },
    { word: "wrold", timeStamp: 2000, wpm: 55 }, // Note: "world" was typed as "wrold"
    { word: "typing", timeStamp: 3000, wpm: 65 },
    { word: "test", timeStamp: 4000, wpm: 70 },
  ];
  const replayData = [
    { event_type: "letter", char: "h", time: 100 },
    { event_type: "letter", char: "e", time: 200 },
    { event_type: "letter", char: "l", time: 300 },
    { event_type: "letter", char: "l", time: 400 },
    { event_type: "letter", char: "o", time: 500 },
    { event_type: "space", char: " ", time: 600 },
    { event_type: "letter", char: "w", time: 700 },
    { event_type: "letter", char: "r", time: 800 },
    { event_type: "letter", char: "o", time: 900 },
    { event_type: "letter", char: "l", time: 1000 },
    { event_type: "letter", char: "d", time: 1100 },
    // ... more replay data
  ];

  // Analyze character statistics
  const characterStats = analyzeCharacterStats(
    actualWords,
    typedWords,
    replayData
  );

  // Get most problematic characters
  const problematicChars = getMostProblematicCharacters(characterStats, 3);
  console.log("Most problematic characters:", problematicChars);

  // Get best performing characters
  const bestChars = getBestPerformingCharacters(characterStats, 3);
  console.log("Best performing characters:", bestChars);

  // Access specific character stats
  console.log("Letter 'o' stats:", characterStats["o"]);
  console.log("Overall stats:", characterStats.overall);

  return {
    characterStats,
    problematicChars,
    bestChars,
  };
}

// Example of how to save character stats to localStorage
export function saveCharacterStats(characterStats: any) {
  try {
    localStorage.setItem(
      "typing-character-stats",
      JSON.stringify(characterStats)
    );
    console.log("Character stats saved successfully");
  } catch (error) {
    console.error("Failed to save character stats:", error);
  }
}

// Example of how to load character stats from localStorage
export function loadCharacterStats() {
  try {
    const savedStats = localStorage.getItem("typing-character-stats");
    if (savedStats) {
      return JSON.parse(savedStats);
    }
  } catch (error) {
    console.error("Failed to load character stats:", error);
  }
  return null;
}

// Example of how to accumulate stats across multiple sessions
export function accumulateCharacterStats(newStats: any) {
  const existingStats = loadCharacterStats();

  if (!existingStats) {
    return newStats;
  }

  // Merge stats (this is a simplified example)
  const accumulatedStats = { ...existingStats };

  Object.keys(newStats).forEach((char) => {
    if (char === "overall") return;

    if (!accumulatedStats[char]) {
      accumulatedStats[char] = {
        correct: 0,
        incorrect: 0,
        missing: 0,
        total: 0,
        accuracy: 0,
      };
    }

    const existing = accumulatedStats[char];
    const newData = newStats[char];

    existing.correct += newData.correct;
    existing.incorrect += newData.incorrect;
    existing.missing += newData.missing;
    existing.total += newData.total;
    existing.accuracy =
      existing.total > 0 ? (existing.correct / existing.total) * 100 : 0;
  });

  // Update overall stats
  const overall = {
    correct: 0,
    incorrect: 0,
    missing: 0,
    total: 0,
    accuracy: 0,
  };

  Object.keys(accumulatedStats).forEach((char) => {
    if (char === "overall") return;
    overall.correct += accumulatedStats[char].correct;
    overall.incorrect += accumulatedStats[char].incorrect;
    overall.missing += accumulatedStats[char].missing;
    overall.total += accumulatedStats[char].total;
  });

  overall.accuracy =
    overall.total > 0 ? (overall.correct / overall.total) * 100 : 0;
  accumulatedStats.overall = overall;

  return accumulatedStats;
}
