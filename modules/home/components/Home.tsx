import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { socket } from "@/common/lib/socket";
import { useModal } from "@/modules/modal";
import { useSetRoomId } from "@/common/recoil/room";
import NotFoundModal from "../modals/NotFound";
import { motion } from "framer-motion";
import Image from "next/image";

const Home = () => {
  const { openModal } = useModal();
  const setAtomRoomId = useSetRoomId();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const router = useRouter();

  useEffect(() => {
    document.body.style.background =
      "linear-gradient(to bottom right, #E3DFFF, #CAB8FF)"; // Purple and lavender gradient
  }, []);

  useEffect(() => {
    socket.on("created", (roomIdFromServer) => {
      setAtomRoomId(roomIdFromServer);
      router.push(roomIdFromServer);
    });

    const handleJoinedRoom = (roomIdFromServer: string, failed?: boolean) => {
      if (!failed) {
        setAtomRoomId(roomIdFromServer);
        router.push(roomIdFromServer);
      } else {
        openModal(<NotFoundModal id={roomId} />);
      }
    };

    socket.on("joined", handleJoinedRoom);

    return () => {
      socket.off("created");
      socket.off("joined", handleJoinedRoom);
    };
  }, [openModal, roomId, router, setAtomRoomId]);

  useEffect(() => {
    socket.emit("leave_room");
    setAtomRoomId("");
  }, [setAtomRoomId]);

  const handleCreateRoom = () => {
    socket.emit("create_room", username);
  };

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (roomId) socket.emit("join_room", roomId, username);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <nav className="w-full py-4 bg-transparent">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center">
            <Image
              src="/SketchSyncLogo.svg"
              alt="SketchSync Logo"
              width={40}
              height={40}
            />
            <h1 className="ml-2 text-xl font-semibold" style={{ color: '#6a4c74' }}>
              SketchSync
            </h1>
          </div>
        </div>
      </nav>

      <motion.div
        className="flex flex-col items-center py-24"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl font-extrabold leading-tight" style={{ color: '#6a4c74' }}>
          SketchSync
        </h1>
        <h3 className="text-lg sm:text-xl text-white">
          A Better Digital Whiteboard
        </h3>

        <div className="mt-10 flex flex-col gap-2 w-80">
          <label className="self-start font-medium leading-tight" style={{ color: '#8a6c94' }}>
            Enter Your Name:
          </label>
          <input
            className="input px-4 py-2 rounded-md border border-purple-300 focus:ring focus:ring-purple-200 focus:outline-none w-full"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value.slice(0, 15))}
          />
        </div>

        <div className="my-8 h-px w-80 bg-purple-200" />

        <form
          className="flex flex-col items-center gap-3 w-80"
          onSubmit={handleJoinRoom}
        >
          <label
            htmlFor="room-id"
            className="self-start font-medium leading-tight"
            style={{ color: '#8a6c94' }}
          >
            Enter Room ID:
          </label>
          <input
            className="input px-4 py-2 rounded-md border border-purple-300 focus:ring focus:ring-purple-200 focus:outline-none w-full"
            id="room-id"
            placeholder="example: xv28"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            className="btn mt-2 w-full px-4 py-2 rounded-md bg-purple-600 text-white font-semibold hover:bg-purple-700 transition duration-200"
            type="submit"
          >
            Join
          </button>
        </form>

        <div className="my-8 flex w-80 items-center gap-2">
          <div className="h-px w-full bg-purple-200" />
          <p className="text-white">or</p>
          <div className="h-px w-full bg-purple-200" />
        </div>

        <div className="flex flex-col items-center gap-2 w-80">
          <h5 className="self-start font-medium leading-tight" style={{ color: '#8a6c94' }}>
            Create New Room
          </h5>

          <button
            className="btn mt-2 w-full px-4 py-2 rounded-md bg-purple-600 text-white font-semibold hover:bg-purple-700 transition duration-200"
            onClick={handleCreateRoom}
          >
            Create
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;