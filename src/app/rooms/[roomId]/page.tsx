export default async function RoomPage( {params} : {params: Promise<{ roomId: string }>} ) {
  const { roomId } = await params;
  return <div className="flex flex-col items-center justify-center h-screen bg-black text-white">#{roomId}</div>;
}

