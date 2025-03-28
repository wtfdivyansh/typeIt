"use client";
import { useSession } from "@/lib/auth-client";
import { Payload } from "@/lib/types";
import { useSocket } from "@/store/use-socket";
import Image from "next/image";
import { useEffect, useState } from "react";
interface Player {
  id: string;
  name: string;
  image: string;
  stats: {
    wpm: number;
    accuracy: number;
  };
}
export const Room = ({code}:{code:string}) => {
  const {data,isPending} = useSession()
  const { socket, isConnected, connect } = useSocket();
  const [players, setPlayers] = useState<Player[]>([]);
  useEffect(() => {
    connect();
    if (socket) {
      socket.onmessage = (event) => {
        const payload = JSON.parse(event.data) 
        console.log(payload)
         const {type,users} = payload
        if (type === "USER_JOINED") {
          setPlayers([...users]);
        }
      };
    }

    return () => {
      socket?.close();
    };
  }, [socket]);
  useEffect(() => {
    if(data && socket){
      console.log("hehe")
      socket.send(JSON.stringify({
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
      }));
    }
  }, [data]);
  return (
    <div className="flex flex-col items-start justify-center h-screen bg-black text-white">
      <div>Room-{isConnected ? "Connected" : "Disconnected"}</div>
      <div>
        {players.map((player) => (
          <div key={player.id} className="flex items-center gap-2">
            <div>{player.name}</div>
            <div>
              <Image src={player.image} alt={player.name} width={32} height={32} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
