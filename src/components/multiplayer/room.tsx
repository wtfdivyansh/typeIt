"use client";
import { useSession } from "@/lib/auth-client";
import { useSocket } from "@/store/use-socket";
import { useEffect, useState } from "react";
import MultiplayerLobby from "./waiting-lobby";

interface Player {
  id: string;
  name: string;
  image: string;
  stats: {
    wpm: number;
    accuracy: number;
  };
}

export const Room = ({ code }: { code: string }) => {
  const { data } = useSession();
  const { socket, isConnected, connect,disconnect } = useSocket();
  const [players, setPlayers] = useState<Player[]>([]);


  useEffect(() => {
    connect();
    return ()=> disconnect();
  }, []);


  useEffect(() => {
    if (data && isConnected && socket) {
    console.log("SENDING DATA");
    socket.send(
      JSON.stringify({
        type: "USER_JOIN",
        data: {
          userId: data.user.id,
          roomCode: code,
          user: {
            id: data.user.id,
            name: data.user.name,
            image: data.user.image,
          },
          room: {
            id: code,
          },
          stats: {
            wpm: 0,
            accuracy: 0,
          },
        },
      })
    );
    console.log("DATA SENT"); 
    }
  }, [data, isConnected, socket]);

  if (!data) return null;

  return (
    <div className="flex flex-col items-start justify-center h-screen bg-black text-white">
      {/* <div>Room - {isConnected ? "Connected" : "Disconnected"}</div> */}
      {/* <div>Players joined: {players.length}</div> */}
        <MultiplayerLobby initialUsers={[]} hostId={data.user.id} code={code} />
    </div>
  );
};
