import { Room } from "@/components/multiplayer/room";
import { getRoom } from "@/data-access/rooms";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const room = await getRoom(roomId);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      {/* <pre>{JSON.stringify(room, null, 2)}</pre> */}
      <Room code={roomId} />
    </div>
  );
}
