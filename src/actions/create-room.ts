"use server";
import { CreateRoomSchema } from "@/components/multiplayer/create-room";
import { room } from "@/db/schema";
import { db } from "@/lib/db";
import { getSession } from "@/lib/get-session";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const createRoom = async (data: z.infer<typeof CreateRoomSchema>) => {
    const user = await getSession();

    if (!user) {
        throw new Error("Unauthorized");
    }
    const createdRoom = await db.insert(room).values({
        name: data.roomName,
        code: crypto.randomUUID().slice(0, 6),
        mode: data.mode,
        userId: user.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning()

    console.log(createdRoom);

    return {code: createdRoom[0].code}
}

export const joinRoom = async (code: string) => {
    const user = await getSession();

    if (!user) {
        throw new Error("Unauthorized");
    }
    const [roomToJoin] = await db.selectDistinct().from(room).where(eq(room.code, code))

    if (!roomToJoin) {
        throw new Error("Room not found");
    }

    return {message: "Room joined", code: roomToJoin.code}

}
