export interface testResultDB {
  id: string;
  originalWords: string[];
  typedWords: string[];
  mode: string;
  accuracy: number;
  wpm: number;
  rawWpm: number;
  date: Date;
}

export type ResEvents =
  | "USER_JOINED"
  | "USER_LEFT"
  | "USER_PROGRESS"
  | "RACE_END"
  | "USER_DISCONNECTED"
  | "RACE_STARTED";

export type Payload = {
  type: ResEvents;
  data: {
    userId: string;
    roomCode: string;
    user: {
      name: string;
      image: string;
    };
    room: {
      id: string;
    };
    stats: {
      wpm: number;
      accuracy: number;
    };
  };
};
