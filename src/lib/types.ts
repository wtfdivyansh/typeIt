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

export type ReqEvents =
  | "USER_JOIN"
  | "USER_LEAVE "
  | "USER_PROGRESS"
  | "RACE_END"
  | "USER_DISCONNECT"
  | "RACE_START";

export type Payload = {
  type: ReqEvents;
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
