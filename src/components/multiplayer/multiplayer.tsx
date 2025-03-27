"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  LogIn,
  Hash,
  Users,
  Clock,
  Trophy,
  Keyboard,
  Globe,
  ChevronRight,
  Zap,
  Shield,
  BookOpen,
  Timer,
  Quote,
  Waves,
  Dices,
} from "lucide-react";
import CreateRoom from "./create-room";

// Custom select component with icons
const CustomSelect = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon: React.ReactNode }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative">
      <label className="text-xs text-zinc-400 mb-1.5 block">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between p-2.5 rounded-lg bg-zinc-800/70 border ${
          isOpen ? "border-emerald-500/50" : "border-zinc-700"
        } cursor-pointer transition-all duration-200`}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon}
          <span>{selectedOption?.label}</span>
        </div>
        <ChevronRight
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="py-1 max-h-60 overflow-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 hover:bg-zinc-700 cursor-pointer transition-colors ${
                    option.value === value
                      ? "bg-emerald-500/10 text-emerald-400"
                      : ""
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default function MultiplayerArenaEnhanced() {
  const [activeTab, setActiveTab] = useState("create");
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  // Mode options with icons
  const modeOptions = [
    {
      value: "words",
      label: "Words",
      icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
    },
    {
      value: "time",
      label: "Time",
      icon: <Timer className="w-4 h-4 text-blue-400" />,
    },
    {
      value: "quote",
      label: "Quote",
      icon: <Quote className="w-4 h-4 text-purple-400" />,
    },
    {
      value: "zen",
      label: "Zen",
      icon: <Waves className="w-4 h-4 text-yellow-400" />,
    },
    {
      value: "custom",
      label: "Custom",
      icon: <Dices className="w-4 h-4 text-pink-400" />,
    },
  ];

  // Option options with icons
  const optionOptions = [
    {
      value: "10",
      label: "10",
      icon: (
        <span className="w-4 h-4 flex items-center justify-center text-emerald-400 font-bold">
          10
        </span>
      ),
    },
    {
      value: "25",
      label: "25",
      icon: (
        <span className="w-4 h-4 flex items-center justify-center text-emerald-400 font-bold">
          25
        </span>
      ),
    },
    {
      value: "50",
      label: "50",
      icon: (
        <span className="w-4 h-4 flex items-center justify-center text-emerald-400 font-bold">
          50
        </span>
      ),
    },
    {
      value: "100",
      label: "100",
      icon: (
        <span className="w-4 h-4 flex items-center justify-center text-emerald-400 font-bold">
          100
        </span>
      ),
    },
  ];

  // Sample public rooms data
  const publicRooms = [
    {
      id: "r1",
      name: "Pro Typists Only",
      players: 3,
      maxPlayers: 5,
      mode: "Words",
      option: "50",
      host: "SpeedDemon",
      difficulty: "Expert",
      status: "waiting",
    },
    {
      id: "r2",
      name: "Casual Practice",
      players: 2,
      maxPlayers: 8,
      mode: "Time",
      option: "60s",
      host: "TypeMaster42",
      difficulty: "Beginner",
      status: "in-progress",
    },
    {
      id: "r3",
      name: "Speed Challenge",
      players: 4,
      maxPlayers: 4,
      mode: "Words",
      option: "100",
      host: "KeyboardWarrior",
      difficulty: "Intermediate",
      status: "waiting",
    },
  ];

  const handleCreateRoom = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Handle room creation logic
    }, 1500);
  };

  const handleJoinRoom = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Handle room joining logic
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white font-mono p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-12"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
            <Keyboard className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              typemaster
            </h1>
            <p className="text-zinc-400 text-sm">multiplayer arena</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-zinc-800/50 rounded-full px-3 py-1.5">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-zinc-300">42 online</span>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left column - Create/Join Room */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-1"
        >
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  Race Against Others
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex mb-6">
                <div
                  className={`flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer transition-all ${
                    activeTab === "create"
                      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-b-2 border-emerald-500"
                      : "border-b border-zinc-800 text-zinc-400 hover:text-zinc-300"
                  }`}
                  onClick={() => setActiveTab("create")}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create</span>
                </div>
                <div
                  className={`flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer transition-all ${
                    activeTab === "join"
                      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-b-2 border-emerald-500"
                      : "border-b border-zinc-800 text-zinc-400 hover:text-zinc-300"
                  }`}
                  onClick={() => setActiveTab("join")}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Join</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "create" ? (
                  <CreateRoom />
                ) : (
                  <motion.div
                    key="join"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs text-zinc-400 mb-1.5 block">
                        Room Code
                      </label>
                      <div className="relative">
                        <Input
                          value={roomCode}
                          onChange={(e) => setRoomCode(e.target.value)}
                          placeholder="Enter room code"
                          className="bg-zinc-800/50 border-zinc-700 focus:border-emerald-500/50 focus:ring-emerald-500/20 pl-10"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <Hash className="w-4 h-4 text-emerald-400" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={handleJoinRoom}
                        disabled={isLoading || !roomCode}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-medium"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Joining Room...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <LogIn className="w-4 h-4 mr-2" /> Join Room
                          </div>
                        )}
                      </Button>
                    </div>

                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                      <h3 className="text-sm font-medium mb-2">
                        Room Code Tips
                      </h3>
                      <ul className="text-xs text-zinc-400 space-y-1">
                        <li className="flex items-start gap-1">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          Room codes are case-sensitive
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          Ask your friend for their room code
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          Codes expire after 24 hours of inactivity
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-emerald-400" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    Public Rooms
                  </span>
                </CardTitle>

                <Badge className="bg-zinc-800 border-zinc-700">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></div>
                  Live Rooms
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {publicRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 group-hover:border-emerald-500/30 transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-lg">{room.name}</h3>
                            {room.status === "in-progress" && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-0 text-xs">
                                In Progress
                              </Badge>
                            )}
                            {room.difficulty === "Expert" && (
                              <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">
                                Expert
                              </Badge>
                            )}
                            {room.difficulty === "Beginner" && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                                Beginner
                              </Badge>
                            )}
                            {room.difficulty === "Intermediate" && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-xs">
                                Intermediate
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center text-xs text-zinc-400">
                              <Users className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                              {room.players}/{room.maxPlayers} players
                            </div>
                            <div className="flex items-center text-xs text-zinc-400">
                              <BookOpen className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                              {room.mode}
                            </div>
                            <div className="flex items-center text-xs text-zinc-400">
                              <Clock className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                              {room.option}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-medium">
                            Join
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {/* Player avatars */}
                        <div className="flex items-center -space-x-2">
                          {Array(room.players)
                            .fill(0)
                            .map((_, i) => (
                              <div
                                key={i}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/30 flex items-center justify-center text-xs font-medium ring-2 ring-zinc-900"
                              >
                                {String.fromCharCode(65 + i)}
                              </div>
                            ))}
                          {Array(room.maxPlayers - room.players)
                            .fill(0)
                            .map((_, i) => (
                              <div
                                key={i}
                                className="w-8 h-8 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center text-zinc-600 text-xs ring-2 ring-zinc-900"
                              >
                                +
                              </div>
                            ))}
                        </div>

                        <div className="flex items-center text-xs text-zinc-400">
                          <Trophy className="w-3.5 h-3.5 mr-1 text-yellow-400" />
                          Host: {room.host}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <Button
                  variant="outline"
                  className="w-full border-zinc-700 hover:bg-zinc-800 hover:text-white mt-4"
                >
                  Show More Rooms
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center text-xs text-zinc-500 mt-8"
      >
        <p>Challenge friends and improve your typing skills together</p>
      </motion.div>
    </div>
  );
}
