import { create } from "zustand";


let socket: WebSocket | null = null;

const getSocket = () => {
  if (!socket) {
    socket = new WebSocket("ws://localhost:8080/");
  }
  return socket;
};

interface SocketStore {
  socket: WebSocket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export const useSocket = create<SocketStore>((set) => ({
  socket: null,
  isConnected: false,
  connect: () => {
    if( socket && socket.readyState === WebSocket.OPEN) {
        return;
    }
     const ws = getSocket();
     set({ socket: ws });
    ws.onopen = (ws) => {
      console.log("Connected to server",ws);
      set({ isConnected: true });
    };

    ws.onclose = () => {
      set({ isConnected: false });
    };

    ws.onerror = (error) => {
      console.error("Socket error:", error);
    };

  },
  disconnect: () => {
    if (socket) {
      socket.close();
      socket = null;
      set({ socket: null });
    }
  },
}));
