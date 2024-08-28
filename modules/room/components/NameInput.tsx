import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { socket } from "@/common/lib/socket";
import { useModal } from "@/modules/modal";
import { useSetRoomId } from "@/common/recoil/room";
import NotFoundModal from "@/modules/home/modals/NotFound";

const NameInput = () => {
  const setRoomId = useSetRoomId();
  const { openModal } = useModal();
  const [name, setName] = useState("");

  const router = useRouter();
  const roomId = (router.query.roomId || "").toString();

  useEffect(() => {
    if (!roomId) return;

    socket.emit("check_room", roomId);

    socket.on("room_exists", (exists) => {
      if (!exists) {
        router.push("/");
      }
    });

    return () => {
      socket.off("room_exists");
    };
  }, [roomId, router]);

  useEffect(() => {
    const handleJoined = (roomIdFromServer: string, failed?: boolean) => {
      if (failed) {
        router.push("/");
        openModal(<NotFoundModal id={roomIdFromServer} />);
      } else setRoomId(roomIdFromServer);
    };

    socket.on("joined", handleJoined);

    return () => {
      socket.off("joined", handleJoined);
    };
  }, [openModal, router, setRoomId]);

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("join_room", roomId, name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-lavender-400 flex flex-col items-center justify-center relative">
      <nav className="w-full py-4 bg-transparent absolute top-0 left-0">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center">
            <Image src="/SketchSyncLogo.svg" alt="SketchSync Logo" width={40} height={40} />
            <h1 className="ml-2 text-2xl font-semibold text-white">SketchSync</h1>
          </div>
        </div>
      </nav>

      <form
        className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 mt-16"
        onSubmit={handleJoinRoom}
      >
        <h1 className="text-4xl font-extrabold text-purple-700">Join a Room</h1>
        <h3 className="text-lg text-purple-500 mt-2 mb-8">-------------------------</h3>

        <div className="flex flex-col gap-4 w-full">
          <label className="text-lg font-semibold text-purple-600 self-start">
            Enter Your Name:
          </label>
          <input
            className="rounded-lg border border-purple-300 px-4 py-2 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            id="room-id"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 15))}
          />
        </div>

        <button
          className="mt-8 bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition duration-200"
          type="submit"
        >
          Enter Room
        </button>
      </form>
    </div>
  );
};

export default NameInput;
