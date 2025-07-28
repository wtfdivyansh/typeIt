"use client";

import { useState, useEffect, useCallback } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RotateCcw, Trophy, Clock, BarChart2, Zap, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/use-settings-store";
import WatchReplay from "./watch-replay";

interface ResultProps {
  result: {
    correct: number;
    incorrect: number;
    missed: number;
  };
  accuracy: number;
  wpm: number;
  wordsWithTimestamp: {
    time: number;
    wpm: number;
  }[];
  wordsReview: {
    word: string;
    wpm: number;
  }[];
  actualWords: string[];
  reset: () => void;
  replayData: replayData[];
}
type ChartData = {
  time: number;
  wpm: number;
};
type replayData = {
  event_type: "backspace" | "space" | "letter" | "prev_word";
  char: string;
  time: number;
  
};
export default function Result({
  result,
  accuracy,
  wpm,
  wordsWithTimestamp,
  wordsReview,
  actualWords,
  reset,
  replayData,
}: ResultProps) {
  const { settings } = useSettingsStore();
  const [activeTab, setActiveTab] = useState("performance");
  const [animatedWpm, setAnimatedWpm] = useState(0);
  const [animatedAcc, setAnimatedAcc] = useState(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const updateChartData = useCallback(() => {
    const groupedData = wordsWithTimestamp.reduce((acc, { time, wpm }) => {
      if (!acc[time]) {
        acc[time] = { sumWpm: 0, count: 0 };
      }
      acc[time].sumWpm += wpm;
      acc[time].count += 1;
      return acc;
    }, {} as Record<number, { sumWpm: number; count: number }>);

    const averagedData = Object.entries(groupedData).map(
      ([timeStamp, { sumWpm, count }]) => ({
        time: Number(timeStamp) + 1,
        wpm: sumWpm / count,
      })
    );

    setChartData(averagedData);
  }, [wordsWithTimestamp]);

  useEffect(() => {
    const wpmTimer = setTimeout(() => {
      setAnimatedWpm(wpm);
    }, 500);

    const accTimer = setTimeout(() => {
      setAnimatedAcc(accuracy);
    }, 800);

    const chartTimer = setTimeout(() => {
      updateChartData();
    }, 500);
    return () => {
      clearTimeout(wpmTimer);
      clearTimeout(accTimer);
      clearTimeout(chartTimer);
    };
  }, []);
  console.log(chartData);
  console.log("replayData", replayData);
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1, ease: "circIn" }}
      className="h-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white font-mono p-8 md:p-8"
    >
      <div className="flex justify-end items-center py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <Badge variant="outline" className="border-zinc-700 text-zinc-400">
            <Clock className="w-3 h-3 mr-1" /> {settings.time}s
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-zinc-800/50 hover:bg-zinc-800"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-zinc-800/50 hover:bg-zinc-800"
          >
            <Trophy className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
            <CardContent className="p-6">
              <div className="text-zinc-400 uppercase text-xs tracking-wider mb-1">
                Words Per Minute
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-7xl font-light tracking-tighter mb-2 text-emerald-400/30"
              >
                {animatedWpm}
                <span className="text-emerald-400 text-xl tracking-wide ml-1">
                  wpm
                </span>
              </motion.div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>Top 15% of all typists</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none"></div>
            <CardContent className="p-6">
              <div className="text-zinc-400 uppercase text-xs tracking-wider mb-1">
                Accuracy
              </div>
              <div className="text-7xl font-light tracking-tighter mb-2 text-blue-400/30">
                {animatedAcc}
                <span className="text-blue-400 text-xl ml-1">%</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <BarChart2 className="w-3 h-3 text-blue-400" />
                <span>
                  {result.correct} correct / {result.incorrect} error /{" "}
                  {result.missed} extra
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6"
      >
        <Tabs
          defaultValue="performance"
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 bg-zinc-900/50 border border-zinc-800 rounded-xl p-1">
            <TabsTrigger
              value="performance"
              className="rounded-lg data-[state=active]:bg-zinc-800"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="rounded-lg data-[state=active]:bg-zinc-800"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-lg data-[state=active]:bg-zinc-800"
            >
              History
            </TabsTrigger>
            <TabsTrigger
              value="review"
              className="rounded-lg data-[state=active]:bg-zinc-800"
            >
              Review
            </TabsTrigger>
            <TabsTrigger
              value="replay"
              className="rounded-lg data-[state=active]:bg-zinc-800"
            >
              Replay
            </TabsTrigger>
          </TabsList>
          <TabsContent value="performance" className="mt-6">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="wpmGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#333333" opacity={0.1} />
                      <XAxis
                        dataKey="time"
                        stroke="#666666"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#666666"
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 120]}
                      />
                      <Tooltip
                        cursor={false}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-zinc-800 border border-zinc-700 rounded-md p-2 shadow-lg">
                                <p className="text-emerald-400 font-medium">{`${Math.round(
                                  payload[0]?.value
                                    ? Math.round(Number(payload[0].value))
                                    : 0
                                )} WPM`}</p>
                                <p className="text-zinc-400 text-xs">{`Time: ${payload[0].payload.time}s`}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="wpm"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#wpmGradient)"
                        activeDot={{
                          r: 6,
                          stroke: "#10b981",
                          strokeWidth: 2,
                          fill: "#0f172a",
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <div className="text-zinc-400 text-xs uppercase tracking-wider">
                      WPM
                    </div>
                    <div className="text-2xl font-light text-gray-100/30">
                      {animatedWpm}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-zinc-400 text-xs uppercase tracking-wider">
                      Characters
                    </div>
                    <div className="text-2xl font-light  text-gray-100/30">
                      {" "}
                      <span className="text-emerald-400/40">
                        {result.correct}
                      </span>{" "}
                      /{" "}
                      <span className="text-red-400/40">
                        {result.incorrect}
                      </span>{" "}
                      /{" "}
                      <span className="text-yellow-400/40">
                        {result.missed}
                      </span>{" "}
                    </div>
                    <div className="text-xs text-zinc-500">
                      correct/incorrect/extra
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-zinc-400 text-xs uppercase tracking-wider ">
                      Accuracy
                    </div>
                    <div className="text-2xl font-light  text-gray-100/30">
                      {animatedAcc}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-zinc-400 text-xs uppercase tracking-wider">
                      Time
                    </div>
                    <div className="text-2xl font-light  text-gray-100/30">
                      {settings.time}s
                    </div>
                    <div className="text-xs  text-gray-100/30">
                      00:00:15 session
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center text-zinc-400 py-8">
                  <p>Sign in to view your typing history</p>
                  <Button
                    variant="outline"
                    className="mt-4 border-zinc-700 hover:bg-zinc-800 hover:text-white"
                  >
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="replay" className="mt-6">
            <WatchReplay replayData={replayData} />
          </TabsContent>
          <TabsContent value="review" className="mt-6">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-zinc-400 py-4 flex flex-wrap gap-2">
                  {wordsReview.map((word, index) => {
                    const typedWord = word.word || "";
                    const actualWord = actualWords[index] || "";
                    const isCorrect = typedWord === actualWord;

                    return (
                      <div
                        className={cn(
                          "relative group cursor-pointer px-1 py-0.5 rounded transition-colors",
                          {
                            "bg-neutral-800/70 hover:bg-zinc-800/70 underline underline-offset-4":
                              !isCorrect,
                          }
                        )}
                        key={index}
                      >
                        <div className="flex">
                          {typedWord.split("").map((letter, letterIndex) => {
                            const actualLetter = actualWord[letterIndex];

                            return (
                              <span
                                key={letterIndex}
                                className={cn("font-mono", {
                                  "text-neutral-100": letter === actualLetter,
                                  "text-red-400": letter !== actualLetter,
                                })}
                              >
                                {letter}
                              </span>
                            );
                          })}
                        </div>
                        <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                          <div className="bg-zinc-800 border border-zinc-700 rounded-md p-3 shadow-lg min-w-[180px]">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-zinc-400">WPM</span>
                              <span className="text-emerald-400 font-medium">
                                {Math.round(word.wpm)}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <div className="text-xs text-zinc-400 mb-1">
                                  Expected
                                </div>
                                <div className="text-sm font-medium text-zinc-200 bg-zinc-900/60 px-2 py-1 rounded">
                                  {actualWord}
                                </div>
                              </div>

                              <div>
                                <div className="text-xs text-zinc-400 mb-1">
                                  You typed
                                </div>
                                <div
                                  className={cn(
                                    "text-sm font-medium px-2 py-1 rounded",
                                    {
                                      "text-zinc-200 bg-zinc-900/60": isCorrect,
                                      "text-red-400 bg-red-950/20": !isCorrect,
                                    }
                                  )}
                                >
                                  {typedWord}
                                </div>
                              </div>
                            </div>

                            <div className="absolute left-1/2 top-full -translate-x-1/2 -mt-[1px]">
                              <div className="border-8 border-transparent border-t-zinc-700"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-center gap-4 mt-8"
      >
        <Button
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-medium rounded-xl px-6"
          onClick={reset}
        >
          New Test
        </Button>
        <Button
          variant="outline"
          className="border-zinc-700 hover:bg-zinc-800 rounded-xl px-6 text-gray-900"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </motion.div>
    </motion.div>
  );
}
