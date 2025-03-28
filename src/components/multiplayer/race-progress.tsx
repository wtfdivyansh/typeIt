"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Keyboard, Flag, Clock, Crown, Zap, BarChart2 } from "lucide-react";

// Mock user data
const users = [
  {
    id: 1,
    name: "You",
    avatar: "Y",
    level: 12,
    wpm: 78,
    accuracy: 96,
    progress: 65,
    wordsTyped: 32,
    charactersTyped: 178,
    errors: 7,
    finished: false,
    finishTime: null,
    color: "emerald",
  },
  {
    id: 2,
    name: "TypeMaster42",
    avatar: "T",
    level: 15,
    wpm: 82,
    accuracy: 94,
    progress: 72,
    wordsTyped: 36,
    charactersTyped: 196,
    errors: 12,
    finished: false,
    finishTime: null,
    color: "blue",
  },
  {
    id: 3,
    name: "SpeedDemon",
    avatar: "S",
    level: 20,
    wpm: 95,
    accuracy: 92,
    progress: 85,
    wordsTyped: 42,
    charactersTyped: 231,
    errors: 19,
    finished: false,
    finishTime: null,
    color: "purple",
  },
  {
    id: 4,
    name: "KeyboardNinja",
    avatar: "K",
    level: 18,
    wpm: 68,
    accuracy: 98,
    progress: 58,
    wordsTyped: 29,
    charactersTyped: 159,
    errors: 3,
    finished: false,
    finishTime: null,
    color: "amber",
  },
];


const totalWords = 50;
const totalCharacters = 275;

export default function MultiplayerProgress() {
  const [raceUsers, setRaceUsers] = useState(users);
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [raceMode, setRaceMode] = useState<"words" | "time">(
    "time"
  );
  const [raceStatus, setRaceStatus] = useState<
    "waiting" | "racing" | "finished"
  >("racing");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return {
          avatar:
            "border-emerald-500/30 bg-gradient-to-br from-emerald-500/30 to-teal-500/30",
          badge: "bg-emerald-500/20 text-emerald-400",
          icon: "text-emerald-400",
          progress: "bg-gradient-to-r from-emerald-500 to-teal-500",
        };
      case "blue":
        return {
          avatar:
            "border-blue-500/30 bg-gradient-to-br from-blue-500/30 to-cyan-500/30",
          badge: "bg-blue-500/20 text-blue-400",
          icon: "text-blue-400",
          progress: "bg-gradient-to-r from-blue-500 to-cyan-500",
        };
      case "purple":
        return {
          avatar:
            "border-purple-500/30 bg-gradient-to-br from-purple-500/30 to-pink-500/30",
          badge: "bg-purple-500/20 text-purple-400",
          icon: "text-purple-400",
          progress: "bg-gradient-to-r from-purple-500 to-pink-500",
        };
      case "amber":
        return {
          avatar:
            "border-amber-500/30 bg-gradient-to-br from-amber-500/30 to-yellow-500/30",
          badge: "bg-amber-500/20 text-amber-400",
          icon: "text-amber-400",
          progress: "bg-gradient-to-r from-amber-500 to-yellow-500",
        };
      default:
        return {
          avatar:
            "border-zinc-500/30 bg-gradient-to-br from-zinc-500/30 to-zinc-600/30",
          badge: "bg-zinc-500/20 text-zinc-400",
          icon: "text-zinc-400",
          progress: "bg-gradient-to-r from-zinc-500 to-zinc-600",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white font-mono p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
            <Keyboard className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              typemaster
            </h1>
            <p className="text-zinc-400 text-sm">multiplayer race</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-zinc-800 border-zinc-700">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            {formatTime(elapsedTime)}
          </Badge>

          <Badge
            className={`
            ${raceStatus === "waiting" ? "bg-zinc-700" : ""}
            ${
              raceStatus === "racing"
                ? "bg-emerald-500/20 text-emerald-400"
                : ""
            }
            ${raceStatus === "finished" ? "bg-blue-500/20 text-blue-400" : ""}
            border-0
          `}
          >
            {raceStatus === "waiting" && "Waiting"}
            {raceStatus === "racing" && "In Progress"}
            {raceStatus === "finished" && "Completed"}
          </Badge>
        </div>
      </motion.div>

      {/* Race Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6">Race Progress</h2>

            {/* User Progress Tracks */}
            <div className="space-y-6">
              {raceUsers.map((user, index) => {
                const colors = getColorClasses(user.color);

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className={`w-8 h-8 border ${colors.avatar}`}>
                          <AvatarFallback className={colors.avatar}>
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name}</span>
                            {user.id === 1 && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                                You
                              </Badge>
                            )}
                            <Badge
                              className={`${colors.badge} border-0 text-xs`}
                            >
                              <Crown className="w-3 h-3 mr-1" />
                              Lv {user.level}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Zap className={`w-4 h-4 ${colors.icon}`} />
                          <span>{user.wpm} WPM</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <BarChart2 className={`w-4 h-4 ${colors.icon}`} />
                          <span>{user.accuracy}% Acc</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <Progress
                        value={user.progress}
                        max={100}
                        className="h-6 bg-zinc-800"
                      />

                      {user.progress > 0 && (
                        <div
                          className="absolute top-1/2 -translate-y-1/2 left-0 ml-2 text-xs text-black font-medium"
                          style={{
                            left: `${Math.min(
                              Math.max(user.progress - 10, 0),
                              90
                            )}%`,
                          }}
                        >
                          {Math.round(user.progress)}%
                        </div>
                      )}

                      {user.finished && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center gap-1 text-xs text-black font-medium">
                          <Flag className="w-3 h-3" />
                          {formatTime(user.finishTime || 0)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Race Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Race Statistics</h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-2 px-4 text-zinc-400 font-medium">
                      Racer
                    </th>
                    <th className="text-center py-2 px-4 text-zinc-400 font-medium">
                      WPM
                    </th>
                    <th className="text-center py-2 px-4 text-zinc-400 font-medium">
                      Accuracy
                    </th>
                    <th className="text-center py-2 px-4 text-zinc-400 font-medium">
                      Words
                    </th>
                    <th className="text-center py-2 px-4 text-zinc-400 font-medium">
                      Characters
                    </th>
                    <th className="text-center py-2 px-4 text-zinc-400 font-medium">
                      Errors
                    </th>
                    <th className="text-center py-2 px-4 text-zinc-400 font-medium">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {raceUsers.map((user, index) => {
                    const colors = getColorClasses(user.color);

                    return (
                      <tr key={user.id} className="border-b border-zinc-800/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Avatar
                              className={`w-6 h-6 border ${colors.avatar}`}
                            >
                              <AvatarFallback className={colors.avatar}>
                                {user.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                            {user.id === 1 && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          {user.wpm}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {user.accuracy}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          {user.wordsTyped}/{totalWords}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {user.charactersTyped}/{totalCharacters}
                        </td>
                        <td className="py-3 px-4 text-center">{user.errors}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="w-full bg-zinc-800 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${colors.progress}`}
                              style={{ width: `${user.progress}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
