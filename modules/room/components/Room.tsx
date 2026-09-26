import { useRouter } from 'next/router';

import { useSocketConnected } from '@/common/hooks/useSocketConnected';
import { useRoom } from '@/common/state/room';

import NameInput from './NameInput';
import UserList from './UserList';
import RoomContextProvider from '../context/Room.context';
import Board from '../modules/board';
import Chat from '../modules/chat';
import ToolBar from '../modules/toolbar';

const ConnectionBanner = () => {
  const connected = useSocketConnected();
  if (connected) return null;

  return (
    <p
      role="status"
      className="absolute top-3 left-1/2 z-50 -translate-x-1/2 rounded-md bg-yellow-300 px-4 py-2 text-sm text-black shadow-lg"
    >
      The connection was lost. Reconnecting…
    </p>
  );
};

const Room = () => {
  const room = useRoom();
  const router = useRouter();
  const routeRoomId =
    typeof router.query.roomId === 'string' ? router.query.roomId.toLowerCase() : '';

  // Ask for a name when the user opens a room link, or a link to a different
  // room than the one they are in.
  if (!room.id || (routeRoomId && routeRoomId !== room.id)) return <NameInput />;

  return (
    <RoomContextProvider>
      <div className="relative h-full w-full overflow-clip">
        <ConnectionBanner />
        <UserList />
        <ToolBar />
        <Board />
        <Chat />
      </div>
    </RoomContextProvider>
  );
};

export default Room;
