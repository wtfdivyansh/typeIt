export interface CharacterStats {
  correct: number;
  incorrect: number;
  missing: number;
  total: number;
  accuracy: number;
}

export interface CharacterAnalysisResult {
  [key: string]: CharacterStats; // key is the character (a-z)
  overall: CharacterStats;
}

/**
 * Analyzes character-level statistics for each letter from A to Z
 * @param actualWords - Array of expected words
 * @param typedWords - Array of typed words with timestamps
 * @param replayData - Array of character events with timestamps
 * @returns Object containing statistics for each character and overall stats
 */
export function analyzeCharacterStats(
  actualWords: string[],
  typedWords: { word: string; timeStamp: number; wpm: number }[],
  replayData: {
    event_type: "backspace" | "space" | "letter" | "prev_word";
    char: string;
    time: number;
  }[]
): CharacterAnalysisResult {
  // Initialize character stats for a-z
  const characterStats: { [key: string]: CharacterStats } = {};

  // Initialize all lowercase letters a-z
  for (let i = 97; i <= 122; i++) {
    const char = String.fromCharCode(i);
    characterStats[char] = {
      correct: 0,
      incorrect: 0,
      missing: 0,
      total: 0,
      accuracy: 0,
    };
  }

  // Initialize overall stats
  const overallStats: CharacterStats = {
    correct: 0,
    incorrect: 0,
    missing: 0,
    total: 0,
    accuracy: 0,
  };

  // Analyze each word
  typedWords.forEach((typedWord, wordIndex) => {
    const actualWord = actualWords[wordIndex] || "";
    const typed = typedWord.word;

    // Compare each character position
    const maxLength = Math.max(actualWord.length, typed.length);

    for (let charIndex = 0; charIndex < maxLength; charIndex++) {
      const expectedChar = actualWord[charIndex] || "";
      const typedChar = typed[charIndex] || "";

      // Convert to lowercase for analysis
      const expectedLower = expectedChar.toLowerCase();
      const typedLower = typedChar.toLowerCase();

      // Only analyze alphabetic characters
      if (expectedLower.match(/[a-z]/)) {
        if (typedLower === expectedLower) {
          // Correct character
          characterStats[expectedLower].correct++;
          overallStats.correct++;
        } else if (typedLower && typedLower.match(/[a-z]/)) {
          // Incorrect character typed
          characterStats[expectedLower].incorrect++;
          characterStats[typedLower].incorrect++;
          overallStats.incorrect++;
        } else {
          // Missing character (not typed)
          characterStats[expectedLower].missing++;
          overallStats.missing++;
        }

        characterStats[expectedLower].total++;
        overallStats.total++;
      }
    }
  });

  // Calculate accuracy for each character
  Object.keys(characterStats).forEach((char) => {
    const stats = characterStats[char];
    stats.accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
  });

  // Calculate overall accuracy
  overallStats.accuracy =
    overallStats.total > 0
      ? (overallStats.correct / overallStats.total) * 100
      : 0;

  return {
    ...characterStats,
    overall: overallStats,
  };
}

/**
 * Gets the most problematic characters (lowest accuracy)
 * @param characterStats - Character analysis result
 * @param limit - Number of characters to return (default: 5)
 * @returns Array of characters sorted by accuracy (worst first)
 */
export function getMostProblematicCharacters(
  characterStats: CharacterAnalysisResult,
  limit: number = 5
): Array<{ char: string; stats: CharacterStats }> {
  const characters = Object.keys(characterStats).filter(
    (key) => key !== "overall"
  );

  return characters
    .map((char) => ({ char, stats: characterStats[char] }))
    .filter((item) => item.stats.total > 0) // Only include characters that were encountered
    .sort((a, b) => a.stats.accuracy - b.stats.accuracy)
    .slice(0, limit);
}

/**
 * Gets the best performing characters (highest accuracy)
 * @param characterStats - Character analysis result
 * @param limit - Number of characters to return (default: 5)
 * @returns Array of characters sorted by accuracy (best first)
 */
export function getBestPerformingCharacters(
  characterStats: CharacterAnalysisResult,
  limit: number = 5
): Array<{ char: string; stats: CharacterStats }> {
  const characters = Object.keys(characterStats).filter(
    (key) => key !== "overall"
  );

  return characters
    .map((char) => ({ char, stats: characterStats[char] }))
    .filter((item) => item.stats.total > 0) // Only include characters that were encountered
    .sort((a, b) => b.stats.accuracy - a.stats.accuracy)
    .slice(0, limit);
}

/**
 * Gets characters that were never encountered in the typing test
 * @param characterStats - Character analysis result
 * @returns Array of characters that were not typed
 */
export function getUnusedCharacters(
  characterStats: CharacterAnalysisResult
): string[] {
  const characters = Object.keys(characterStats).filter(
    (key) => key !== "overall"
  );

  return characters.filter((char) => characterStats[char].total === 0);
}
