"use client";

import { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  RotateCcw,
  Trophy,
  Keyboard,
  Clock,
  BarChart2,
  Zap,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";

// Sample performance data
const performanceData = [
  { time: 1, wpm: 70, accuracy: 92 },
  { time: 2, wpm: 85, accuracy: 94 },
  { time: 3, wpm: 90, accuracy: 95 },
  { time: 4, wpm: 88, accuracy: 96 },
  { time: 5, wpm: 92, accuracy: 97 },
  { time: 6, wpm: 89, accuracy: 98 },
  { time: 7, wpm: 85, accuracy: 97 },
  { time: 8, wpm: 82, accuracy: 96 },
  { time: 9, wpm: 88, accuracy: 97 },
  { time: 10, wpm: 90, accuracy: 98 },
  { time: 11, wpm: 89, accuracy: 98 },
  { time: 12, wpm: 91, accuracy: 99 },
  { time: 13, wpm: 88, accuracy: 98 },
  { time: 14, wpm: 90, accuracy: 97 },
  { time: 15, wpm: 99, accuracy: 98 },
];

interface ResultProps {
  result: {
    correct: number;
    incorrect: number;
    missed: number;
  };
  accuracy: number;
  wpm: number;
  wordsWithTimestamp: {
    word: string;
    timeStamp: number;
  }[];
  reset: () => void;
}

export default function Result({
    result,
    accuracy,
    wpm,
    wordsWithTimestamp,
    reset
  }: ResultProps) {
  const [activeTab, setActiveTab] = useState("performance");
  const [animatedWpm, setAnimatedWpm] = useState(0);
  const [animatedAcc, setAnimatedAcc] = useState(0);

  useEffect(() => {
    const wpmTimer = setTimeout(() => {
      setAnimatedWpm(wpm);
    }, 500);

    const accTimer = setTimeout(() => {
      setAnimatedAcc(accuracy);
    }, 800);

    return () => {
      clearTimeout(wpmTimer);
      clearTimeout(accTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white font-mono p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        {/* <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
            <Keyboard className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
            typemaster
          </h1>
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <Badge variant="outline" className="border-zinc-700 text-zinc-400">
            <Clock className="w-3 h-3 mr-1" /> 15s
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

      {/* Main Stats Cards */}
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
              <div className="text-7xl font-light tracking-tighter mb-2">
                {animatedWpm}
                <span className="text-emerald-400 text-xl ml-1">wpm</span>
              </div>
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
              <div className="text-7xl font-light tracking-tighter mb-2">
                {animatedAcc}
                <span className="text-blue-400 text-xl ml-1">%</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <BarChart2 className="w-3 h-3 text-blue-400" />
                <span>{result.correct} correct / {result.incorrect} error / {result.missed} extra</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
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
          <TabsList className="grid grid-cols-3 bg-zinc-900/50 border border-zinc-800 rounded-xl p-1">
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
          </TabsList>

          <TabsContent value="performance" className="mt-6">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={wordsWithTimestamp}>
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
                        <linearGradient
                          id="accuracyGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
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
                      <Area
                        type="monotone"
                        dataKey="wpm"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#wpmGradient)"
                      />
                      {/* <Area
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#accuracyGradient)"
                      /> */}
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
                      Raw WPM
                    </div>
                    <div className="text-2xl font-light">102</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-zinc-400 text-xs uppercase tracking-wider">
                      Characters
                    </div>
                    <div className="text-2xl font-light">124/1/0/0</div>
                    <div className="text-xs text-zinc-500">
                      correct/incorrect/missed/extra
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-zinc-400 text-xs uppercase tracking-wider">
                      Consistency
                    </div>
                    <div className="text-2xl font-light">82%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-zinc-400 text-xs uppercase tracking-wider">
                      Time
                    </div>
                    <div className="text-2xl font-light">15s</div>
                    <div className="text-xs text-zinc-500">
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
        </Tabs>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-center gap-4 mt-8"
      >
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-medium rounded-xl px-6" onClick={reset}>
          New Test
        </Button>
        <Button
          variant="outline"
          className="border-zinc-700 hover:bg-zinc-800 rounded-xl px-6"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 text-center text-xs text-zinc-500"
      >
        <p>Designed with ♥ for modern typists</p>
      </motion.div>
    </div>
  );
}
