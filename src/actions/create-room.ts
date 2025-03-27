"use server";
import { CreateRoomSchema } from "@/components/multiplayer/create-room";
import { room } from "@/db/schema";
import { db } from "@/lib/db";
import { getSession } from "@/lib/get-session";
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

