"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  analyzeCharacterStats,
  getMostProblematicCharacters,
  getBestPerformingCharacters,
  getUnusedCharacters,
  type CharacterAnalysisResult,
} from "@/lib/character-stats";

interface CharacterStatsProps {
  actualWords: string[];
  typedWords: { word: string; timeStamp: number; wpm: number }[];
  replayData: {
    event_type: "backspace" | "space" | "letter" | "prev_word";
    char: string;
    time: number;
  }[];
}

export default function CharacterStats({
  actualWords,
  typedWords,
  replayData,
}: CharacterStatsProps) {
  const characterStats = analyzeCharacterStats(
    actualWords,
    typedWords,
    replayData
  );
  const problematicChars = getMostProblematicCharacters(characterStats, 5);
  const bestChars = getBestPerformingCharacters(characterStats, 5);
  const unusedChars = getUnusedCharacters(characterStats);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-emerald-400";
    if (accuracy >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getAccuracyBgColor = (accuracy: number) => {
    if (accuracy >= 90) return "bg-emerald-500/20";
    if (accuracy >= 70) return "bg-yellow-500/20";
    return "bg-red-500/20";
  };

  return (
    <div className="space-y-6">
      {/* Overall Character Stats */}
      <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-zinc-100 text-lg">
            Character Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {characterStats.overall.correct}
              </div>
              <div className="text-xs text-zinc-400">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {characterStats.overall.incorrect}
              </div>
              <div className="text-xs text-zinc-400">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {characterStats.overall.missing}
              </div>
              <div className="text-xs text-zinc-400">Missing</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${getAccuracyColor(
                  characterStats.overall.accuracy
                )}`}
              >
                {characterStats.overall.accuracy.toFixed(1)}%
              </div>
              <div className="text-xs text-zinc-400">Accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Problematic Characters */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-red-400 text-lg">
              Most Problematic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {problematicChars.map((item, index) => (
                <motion.div
                  key={item.char}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-mono font-bold text-zinc-100">
                      {item.char.toUpperCase()}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {item.stats.total} attempts
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${getAccuracyColor(
                        item.stats.accuracy
                      )}`}
                    >
                      {item.stats.accuracy.toFixed(1)}%
                    </div>
                    <div className="text-xs text-zinc-500">
                      {item.stats.correct}/{item.stats.total}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Best Performing Characters */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-400 text-lg">
              Best Performing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bestChars.map((item, index) => (
                <motion.div
                  key={item.char}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-mono font-bold text-zinc-100">
                      {item.char.toUpperCase()}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {item.stats.total} attempts
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${getAccuracyColor(
                        item.stats.accuracy
                      )}`}
                    >
                      {item.stats.accuracy.toFixed(1)}%
                    </div>
                    <div className="text-xs text-zinc-500">
                      {item.stats.correct}/{item.stats.total}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Character Grid */}
      <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-zinc-100 text-lg">
            All Characters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="grid grid-cols-13 gap-1"
            style={{ gridTemplateColumns: "repeat(13, 1fr)" }}
          >
            {Array.from({ length: 26 }, (_, i) => {
              const char = String.fromCharCode(97 + i); // a-z
              const stats = characterStats[char];
              const isUnused = unusedChars.includes(char);

              return (
                <motion.div
                  key={char}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  className={`
                    aspect-square flex flex-col items-center justify-center rounded-lg border
                    ${
                      isUnused
                        ? "bg-zinc-800/30 border-zinc-700 text-zinc-500"
                        : `${getAccuracyBgColor(
                            stats.accuracy
                          )} border-zinc-700`
                    }
                  `}
                >
                  <div className="text-lg font-mono font-bold text-zinc-100">
                    {char.toUpperCase()}
                  </div>
                  {!isUnused && (
                    <>
                      <div
                        className={`text-xs font-bold ${getAccuracyColor(
                          stats.accuracy
                        )}`}
                      >
                        {stats.accuracy.toFixed(0)}%
                      </div>
                      <div className="text-xs text-zinc-400">{stats.total}</div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
