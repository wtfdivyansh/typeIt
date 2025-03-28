"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Keyboard,
  Users,
  Crown,
  Clock,
  Copy,
  Check,
  X,
  MessageSquare,
  Send,
  Settings,
  BookOpen,
  Timer,
  ArrowLeft,
  Play,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useSocket } from "@/store/use-socket";
import { useSession } from "@/lib/auth-client";

const initialUsers = [
  {
    id: 1,
    name: "You",
    avatar: "Y",
    level: 12,
    isHost: true,
    isReady: true,
    joinedAt: new Date(Date.now() - 120000), // 2 minutes ago
    color: "emerald",
  },
  {
    id: 2,
    name: "TypeMaster42",
    avatar: "T",
    level: 15,
    isHost: false,
    isReady: true,
    joinedAt: new Date(Date.now() - 60000), // 1 minute ago
    color: "blue",
  },
  {
    id: 3,
    name: "SpeedDemon",
    avatar: "S",
    level: 20,
    isHost: false,
    isReady: false,
    joinedAt: new Date(Date.now() - 30000), // 30 seconds ago
    color: "purple",
  },
];

const initialMessages = [
  {
    id: 1,
    userId: 1,
    userName: "You",
    message: "Hey everyone, ready for a race?",
    timestamp: new Date(Date.now() - 90000),
  },
  {
    id: 2,
    userId: 2,
    userName: "TypeMaster42",
    message: "Let's go! I've been practicing all day.",
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: 3,
    userId: 3,
    userName: "SpeedDemon",
    message: "Just joined, give me a sec to get ready.",
    timestamp: new Date(Date.now() - 20000),
  },
];
export type Message = {
  id: string;
  name?: string;
  image?: string;
  message: string;
  isServer?:Boolean
};
export default function MultiplayerLobby({
  initialUsers,

}: {
  initialUsers: User[];
}) {
  const { data: session } = useSession();
  const [users, setUsers] = useState(initialUsers);
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomCode, setRoomCode] = useState("RACE-4269");
  const [copied, setCopied] = useState(false);
  const [lobbyStatus, setLobbyStatus] = useState<
    "waiting" | "starting" | "ready"
  >("waiting");
  const [countdown, setCountdown] = useState(5);
  const [raceSettings, setRaceSettings] = useState({
    mode: "words",
    option: "50",
    difficulty: "medium",
  });
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [raceMode, setRaceMode] = useState<"words" | "time">("time");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: crypto.randomUUID(),
      name: session?.user?.name,
      image: session?.user?.image ||  "",
      message: newMessage.trim(),
    };

    socket?.send(JSON.stringify({
      type: "ROOM_MESSAGE_SENT",
      message,
    }));

    setNewMessage("");
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartRace = () => {
    const allReady = users.every((user) => user.isReady);

    if (allReady) {
      setLobbyStatus("starting");

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          userId: 0, // System message
          userName: "System",
          message: "Race is starting! Get ready...",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return {
          avatar:
            "border-emerald-500/30 bg-gradient-to-br from-emerald-500/30 to-teal-500/30",
          badge: "bg-emerald-500/20 text-emerald-400",
          icon: "text-emerald-400",
        };
      case "blue":
        return {
          avatar:
            "border-blue-500/30 bg-gradient-to-br from-blue-500/30 to-cyan-500/30",
          badge: "bg-blue-500/20 text-blue-400",
          icon: "text-blue-400",
        };
      case "purple":
        return {
          avatar:
            "border-purple-500/30 bg-gradient-to-br from-purple-500/30 to-pink-500/30",
          badge: "bg-purple-500/20 text-purple-400",
          icon: "text-purple-400",
        };
      case "amber":
        return {
          avatar:
            "border-amber-500/30 bg-gradient-to-br from-amber-500/30 to-yellow-500/30",
          badge: "bg-amber-500/20 text-amber-400",
          icon: "text-amber-400",
        };
      default:
        return {
          avatar:
            "border-zinc-500/30 bg-gradient-to-br from-zinc-500/30 to-zinc-600/30",
          badge: "bg-zinc-500/20 text-zinc-400",
          icon: "text-zinc-400",
        };
    }
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "ROOM_MESSAGE_RECIEVED") {
          setMessages((prev) => [...prev, data.message]);
        }
      };
    }
  }, [socket]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white font-mono p-4 md:p-8">
      {/* Countdown Overlay */}
      <AnimatePresence>
        {lobbyStatus === "starting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-4 text-emerald-400">
                Race Starting In
              </h2>
              <motion.div
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-8xl font-bold text-white mb-8"
              >
                {countdown}
              </motion.div>
              <p className="text-zinc-400">Get your fingers ready!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <p className="text-zinc-400 text-sm">multiplayer lobby</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Leave Lobby
          </Button>

          <Badge className="bg-zinc-800 border-zinc-700">
            <Users className="w-3.5 h-3.5 mr-1.5" />
            {users.length}/8
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Room Info & Users */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Room Info */}
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  Room Information
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-zinc-400 mb-1">Room Code</div>
                  <div className="flex items-center gap-2">
                    <div className="bg-zinc-800 rounded-lg px-3 py-2 font-mono text-lg flex-1 text-center">
                      {roomCode}
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-zinc-700 hover:bg-zinc-800"
                            onClick={handleCopyRoomCode}
                          >
                            {copied ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{copied ? "Copied!" : "Copy room code"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-zinc-400 mb-1">Mode</div>
                    <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span className="capitalize">{raceSettings.mode}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-zinc-400 mb-1">Length</div>
                    <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                      {raceSettings.mode === "words" ? (
                        <>
                          <BookOpen className="w-4 h-4 text-emerald-400" />{" "}
                          {raceSettings.option} words
                        </>
                      ) : (
                        <>
                          <Timer className="w-4 h-4 text-emerald-400" />{" "}
                          {raceSettings.option} seconds
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-zinc-400 mb-1">Difficulty</div>
                  <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                    <Badge
                      className={`
                      ${
                        raceSettings.difficulty === "easy"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : ""
                      }
                      ${
                        raceSettings.difficulty === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : ""
                      }
                      ${
                        raceSettings.difficulty === "hard"
                          ? "bg-red-500/20 text-red-400"
                          : ""
                      }
                      border-0
                    `}
                    >
                      {raceSettings.difficulty}
                    </Badge>
                    <span className="text-sm text-zinc-400">
                      {raceSettings.difficulty === "easy" ? "Common words" : ""}
                      {raceSettings.difficulty === "medium"
                        ? "Mixed vocabulary"
                        : ""}
                      {raceSettings.difficulty === "hard"
                        ? "Advanced vocabulary"
                        : ""}
                    </span>
                  </div>
                </div>

                {users[0].isHost && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-zinc-700 hover:bg-zinc-800"
                  >
                    <Settings className="w-4 h-4 mr-2" /> Edit Settings
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  Players ({users.length}/8)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {users.map((user) => {
                  const colors = getColorClasses(user.color);

                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
                    >
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
                            {user.isHost && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-xs">
                                <Crown className="w-3 h-3 mr-1" /> Host
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-zinc-400">
                            Level {user.level}
                          </div>
                        </div>
                      </div>

                      <div>
                        {user.isReady ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready
                          </Badge>
                        ) : (
                          <Badge className="bg-zinc-700 text-zinc-400 border-0">
                            <Clock className="w-3.5 h-3.5 mr-1" /> Not Ready
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Chat & Start Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-emerald-400" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  Lobby Chat
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1 overflow-hidden">
              <div className="h-[400px] overflow-y-auto mb-4 pr-2 space-y-3">
                {messages.map((message) => {
                  const isSystem = message.userId === 0;
                  const isCurrentUser = message.userId === 1;
                  const user = users.find((u) => u.id === message.userId);
                  const colors = user
                    ? getColorClasses(user.color)
                    : getColorClasses("emerald");

                  return (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        isSystem ? "opacity-70" : ""
                      }`}
                    >
                      {!isSystem && (
                        <Avatar
                          className={`w-8 h-8 mt-0.5 border ${colors.avatar}`}
                        >
                          <AvatarFallback className={colors.avatar}>
                            {user?.avatar || "S"}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {isSystem ? (
                            <span className="text-xs text-zinc-500">
                              System
                            </span>
                          ) : (
                            <>
                              <span
                                className={`font-medium ${
                                  isCurrentUser ? "text-emerald-400" : ""
                                }`}
                              >
                                {message.userName}
                              </span>
                              {isCurrentUser && (
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                                  You
                                </Badge>
                              )}
                            </>
                          )}
                          <span className="text-xs text-zinc-500">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            isSystem ? "text-zinc-400 italic" : ""
                          }`}
                        >
                          {message.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-zinc-800/70 border-zinc-700 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="border-zinc-700 hover:bg-zinc-800"
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              {users[0].isHost ? (
                <div className="w-full">
                  <Button
                    className="w-full relative group overflow-hidden"
                    disabled={!lobbyStatus === "ready"}
                    onClick={handleStartRace}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:from-emerald-600 group-hover:to-teal-600 transition-colors"></div>
                    <span className="relative flex items-center justify-center py-2 text-black font-medium">
                      <Play className="w-4 h-4 mr-2" />
                      {lobbyStatus === "ready"
                        ? "Start Race"
                        : "Waiting for players..."}
                    </span>
                  </Button>

                  {lobbyStatus !== "ready" && (
                    <div className="flex items-center justify-center gap-2 mt-2 text-xs text-zinc-400">
                      <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Waiting for all players to be ready</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full">
                  <Button
                    className="w-full relative group overflow-hidden"
                    onClick={() => {
                      // Toggle ready status for current user
                      setUsers((prev) =>
                        prev.map((user) =>
                          user.id === 1
                            ? { ...user, isReady: !user.isReady }
                            : user
                        )
                      );
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:from-emerald-600 group-hover:to-teal-600 transition-colors"></div>
                    <span className="relative flex items-center justify-center py-2 text-black font-medium">
                      {users[0].isReady ? (
                        <>
                          <X className="w-4 h-4 mr-2" /> Not Ready
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" /> Ready Up
                        </>
                      )}
                    </span>
                  </Button>

                  <div className="flex items-center justify-center gap-2 mt-2 text-xs text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Waiting for host to start the race</span>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
