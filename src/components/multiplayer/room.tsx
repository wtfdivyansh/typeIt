"use client";
import { useSocket } from "@/store/use-socket";
import { useEffect } from "react";

export const Room = () => {
  const { socket, isConnected, connect } = useSocket();
  useEffect(() => {
    connect();
    if (socket) {
      socket.onmessage = (event) => {
        console.log(event.data);
      };
    }
  }, []);
  return <div>Room-{isConnected ? "Connected" : "Disconnected"}</div>;
};
