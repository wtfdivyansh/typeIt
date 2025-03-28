import { room } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export const getRoom = async (code: string) => {
  const rooms = await db.select().from(room).where(eq(room.code, code));
  return rooms[0];
};

