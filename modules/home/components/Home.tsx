import { useEffect, useState, useSyncExternalStore, type FormEvent } from 'react';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import ServerStatus from '@/common/components/ServerStatus';
import { MAX_USERNAME_LENGTH } from '@/common/constants/limits';
import { useSocketConnected } from '@/common/hooks/useSocketConnected';
import { socket } from '@/common/lib/socket';
import { loadUsername, saveUsername } from '@/common/lib/username';
import { useResetRoom, useSetRoomId } from '@/common/state/room';
import { useModal } from '@/modules/modal';

import NotFoundModal from '../modals/NotFound';

const subscribeNothing = () => () => {};

const inputClass =
  'input w-full rounded-md border border-purple-300 px-4 py-2 focus:ring-3 focus:ring-purple-200 focus:outline-hidden';
const buttonClass =
  'btn mt-2 w-full rounded-md bg-purple-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50';
const labelClass = 'self-start leading-tight font-medium text-[#8a6c94]';

const Home = () => {
  const { openModal } = useModal();
  const setAtomRoomId = useSetRoomId();
  const resetRoom = useResetRoom();
  const connected = useSocketConnected();
  const router = useRouter();

  const [roomId, setRoomId] = useState('');
  const savedName = useSyncExternalStore(subscribeNothing, loadUsername, () => '');
  const [typedName, setTypedName] = useState<string | null>(null);
  const username = typedName ?? savedName;

  useEffect(() => {
    document.body.style.background = 'linear-gradient(to bottom right, #E3DFFF, #CAB8FF)';
    return () => {
      document.body.style.background = '';
    };
  }, []);

  // The user is on the home page, so they are in no room.
  useEffect(() => {
    socket.emit('leave_room');
    resetRoom();
  }, [resetRoom]);

  useEffect(() => {
    const handleCreated = (newRoomId: string) => {
      if (!newRoomId) {
        toast.error('The server could not create a room. Try again later.', {
          position: 'top-center',
        });
        return;
      }
      setAtomRoomId(newRoomId, username);
      router.push(`/${newRoomId}`);
    };

    const handleJoined = (joinedRoomId: string, failed?: boolean) => {
      if (failed) {
        openModal(<NotFoundModal id={joinedRoomId || roomId.trim()} />);
        return;
      }
      setAtomRoomId(joinedRoomId, username);
      router.push(`/${joinedRoomId}`);
    };

    socket.on('created', handleCreated);
    socket.on('joined', handleJoined);

    return () => {
      socket.off('created', handleCreated);
      socket.off('joined', handleJoined);
    };
  }, [openModal, roomId, router, setAtomRoomId, username]);

  const handleCreateRoom = () => {
    saveUsername(username);
    socket.emit('create_room', username);
  };

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = roomId.trim().toLowerCase();
    if (!id) return;

    saveUsername(username);
    socket.emit('join_room', id, username);
  };

  return (
    <div className="flex min-h-screen flex-col items-center">
      <nav className="w-full bg-transparent py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center">
            <Image src="/SketchSyncLogo.svg" alt="" width={40} height={40} priority />
            <span className="ml-2 text-xl font-semibold text-[#6a4c74]">SketchSync</span>
          </div>
        </div>
      </nav>

      <motion.main
        className="flex flex-col items-center py-24"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl leading-tight font-extrabold text-[#6a4c74]">SketchSync</h1>
        <p className="text-lg text-white sm:text-xl">A Better Digital Whiteboard</p>

        <div className="mt-10 flex w-80 flex-col gap-2">
          <label htmlFor="username" className={labelClass}>
            Enter Your Name:
          </label>
          <input
            className={inputClass}
            id="username"
            placeholder="Username"
            maxLength={MAX_USERNAME_LENGTH}
            value={username}
            onChange={(e) => setTypedName(e.target.value.slice(0, MAX_USERNAME_LENGTH))}
          />
        </div>

        <div className="my-8 h-px w-80 bg-purple-200" />

        <form className="flex w-80 flex-col items-center gap-3" onSubmit={handleJoinRoom}>
          <label htmlFor="room-id" className={labelClass}>
            Enter Room ID:
          </label>
          <input
            className={inputClass}
            id="room-id"
            placeholder="example: xv28"
            autoComplete="off"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button className={buttonClass} type="submit" disabled={!connected || !roomId.trim()}>
            Join
          </button>
        </form>

        <div className="my-8 flex w-80 items-center gap-2">
          <div className="h-px w-full bg-purple-200" />
          <p className="text-white">or</p>
          <div className="h-px w-full bg-purple-200" />
        </div>

        <div className="flex w-80 flex-col items-center gap-2">
          <h2 className={labelClass}>Create New Room</h2>
          <button
            className={buttonClass}
            type="button"
            disabled={!connected}
            onClick={handleCreateRoom}
          >
            Create
          </button>
        </div>

        <ServerStatus />
      </motion.main>
    </div>
  );
};

export default Home;
