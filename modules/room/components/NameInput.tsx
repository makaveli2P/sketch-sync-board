import { useEffect, useState, useSyncExternalStore, type FormEvent } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import ServerStatus from '@/common/components/ServerStatus';
import { MAX_USERNAME_LENGTH } from '@/common/constants/limits';
import { useSocketConnected } from '@/common/hooks/useSocketConnected';
import { socket } from '@/common/lib/socket';
import { loadUsername, saveUsername } from '@/common/lib/username';
import { useSetRoomId } from '@/common/state/room';
import NotFoundModal from '@/modules/home/modals/NotFound';
import { useModal } from '@/modules/modal';

const subscribeNothing = () => () => {};

const NameInput = () => {
  const setRoomId = useSetRoomId();
  const { openModal } = useModal();
  const connected = useSocketConnected();
  const router = useRouter();
  const roomId = typeof router.query.roomId === 'string' ? router.query.roomId.toLowerCase() : '';

  const savedName = useSyncExternalStore(subscribeNothing, loadUsername, () => '');
  const [typedName, setTypedName] = useState<string | null>(null);
  const name = typedName ?? savedName;

  useEffect(() => {
    if (!roomId) return undefined;

    const handleRoomExists = (exists: boolean) => {
      if (exists) return;
      toast.error(`The room "${roomId}" does not exist.`, { position: 'top-center' });
      router.push('/');
    };

    socket.on('room_exists', handleRoomExists);
    socket.emit('check_room', roomId);

    return () => {
      socket.off('room_exists', handleRoomExists);
    };
  }, [roomId, router]);

  useEffect(() => {
    const handleJoined = (joinedRoomId: string, failed?: boolean) => {
      if (failed) {
        router.push('/');
        openModal(<NotFoundModal id={joinedRoomId || roomId} />);
      } else setRoomId(joinedRoomId, name);
    };

    socket.on('joined', handleJoined);
    return () => {
      socket.off('joined', handleJoined);
    };
  }, [name, openModal, roomId, router, setRoomId]);

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveUsername(name);
    socket.emit('join_room', roomId, name);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-[#E3DFFF] to-[#CAB8FF]">
      <nav className="absolute top-0 left-0 w-full bg-transparent py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center">
            <Image src="/SketchSyncLogo.svg" alt="" width={40} height={40} />
            <span className="ml-2 text-2xl font-semibold text-[#6a4c74]">SketchSync</span>
          </div>
        </div>
      </nav>

      <form
        className="mt-16 flex flex-col items-center rounded-2xl bg-white p-8 shadow-lg"
        onSubmit={handleJoinRoom}
      >
        <h1 className="text-4xl font-extrabold text-purple-700">Join a Room</h1>
        <p className="mt-2 mb-8 text-lg text-purple-500">Room {roomId}</p>

        <div className="flex w-full flex-col gap-4">
          <label htmlFor="username" className="self-start text-lg font-semibold text-purple-600">
            Enter Your Name:
          </label>
          <input
            className="rounded-lg border border-purple-300 px-4 py-2 text-purple-900 placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            id="username"
            placeholder="Username"
            maxLength={MAX_USERNAME_LENGTH}
            value={name}
            onChange={(e) => setTypedName(e.target.value.slice(0, MAX_USERNAME_LENGTH))}
          />
        </div>

        <button
          className="mt-8 rounded-lg bg-purple-600 px-6 py-2 text-white transition duration-200 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={!connected || !roomId}
        >
          Enter Room
        </button>
      </form>

      <ServerStatus />
    </div>
  );
};

export default NameInput;
