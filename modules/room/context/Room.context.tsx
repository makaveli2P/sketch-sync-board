import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from 'react';

import { useStore } from 'jotai';
import { useMotionValue, type MotionValue } from 'motion/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { socket } from '@/common/lib/socket';
import { roomAtom, useApplySnapshot, useSetUsers } from '@/common/state/room';
import type { Move, Rect, RoomSnapshot } from '@/common/types/global';

export interface MoveImageState {
  base64: string;
  // Screen position. Leave it out to use the default position.
  x?: number;
  y?: number;
  // For a moved selection: the board area to erase when the user places
  // the image. A cancel keeps the original content.
  eraseArea?: Rect;
}

// Own moves that the server did not confirm yet, and undos that wait for
// them. An undo must wait, because the server undoes its last received move.
export interface PendingState {
  moves: number;
  undos: number;
}

// Board actions that the toolbar and the selection buttons call. The board
// sets them, because they need the board's drawing state.
export interface BoardActions {
  undo: () => void;
  redo: () => void;
  moveSelection: () => void;
  copySelection: () => void;
  deleteSelection: () => void;
}

const noop = () => {};

interface RoomContext {
  x: MotionValue<number>;
  y: MotionValue<number>;
  ctx: CanvasRenderingContext2D | null;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  setCanvas: (node: HTMLCanvasElement | null) => void;
  bgRef: RefObject<HTMLCanvasElement | null>;
  minimapRef: RefObject<HTMLCanvasElement | null>;
  actionsRef: RefObject<BoardActions>;
  moveImage: MoveImageState;
  setMoveImage: Dispatch<SetStateAction<MoveImageState>>;
  pendingRef: RefObject<PendingState>;
  // Sends an own move to the server. Use it for every own move.
  emitMove: (move: Move) => void;
}

export const roomContext = createContext<RoomContext>(null!);

export const TOAST_OPTIONS = { position: 'top-center', theme: 'colored' } as const;

const RoomContextProvider = ({ children }: { children: ReactNode }) => {
  const store = useStore();
  const router = useRouter();
  const applySnapshot = useApplySnapshot();
  const { handleAddUser, handleRemoveUser } = useSetUsers();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const actionsRef = useRef<BoardActions>({
    undo: noop,
    redo: noop,
    moveSelection: noop,
    copySelection: noop,
    deleteSelection: noop,
  });

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [moveImage, setMoveImage] = useState<MoveImageState>({ base64: '' });
  const pendingRef = useRef<PendingState>({ moves: 0, undos: 0 });

  const emitMove = useCallback((move: Move) => {
    pendingRef.current.moves += 1;
    socket.emit('draw', move);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const setCanvas = useCallback((node: HTMLCanvasElement | null) => {
    canvasRef.current = node;
    const newCtx = node?.getContext('2d') ?? null;
    if (newCtx) {
      newCtx.lineJoin = 'round';
      newCtx.lineCap = 'round';
    }
    setCtx(newCtx);
  }, []);

  useEffect(() => {
    const handleRoom = (snapshot: RoomSnapshot) => applySnapshot(snapshot, socket.id);

    const handleNewUser = (userId: string, username: string) => {
      toast(`${username} has joined the room.`, TOAST_OPTIONS);
      handleAddUser(userId, username);
    };

    const handleUserDisconnected = (userId: string) => {
      const name = store.get(roomAtom).users.get(userId)?.name;
      if (name) toast(`${name} has left the room.`, TOAST_OPTIONS);
      handleRemoveUser(userId);
    };

    // After a reconnect the socket has a new id and is in no room, so join
    // the room again with the same name.
    let rejoining = false;
    const handleReconnect = () => {
      const { id, username } = store.get(roomAtom);
      if (!id) return;
      rejoining = true;
      socket.emit('join_room', id, username);
    };

    const handleJoined = (_roomId: string, failed?: boolean) => {
      if (!rejoining) return;
      rejoining = false;

      if (failed) {
        toast.error('The room is no longer available.', TOAST_OPTIONS);
        router.push('/');
        return;
      }
      socket.emit('joined_room');
    };

    // After a lost connection the server confirms nothing that was pending.
    // The room snapshot after the rejoin shows the real state.
    const handleDisconnect = () => {
      pendingRef.current = { moves: 0, undos: 0 };
    };

    socket.on('room', handleRoom);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_user', handleNewUser);
    socket.on('user_disconnected', handleUserDisconnected);
    socket.on('joined', handleJoined);
    socket.io.on('reconnect', handleReconnect);

    return () => {
      socket.off('room', handleRoom);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_user', handleNewUser);
      socket.off('user_disconnected', handleUserDisconnected);
      socket.off('joined', handleJoined);
      socket.io.off('reconnect', handleReconnect);
    };
  }, [applySnapshot, handleAddUser, handleRemoveUser, router, store]);

  return (
    <roomContext.Provider
      value={{
        x,
        y,
        ctx,
        canvasRef,
        setCanvas,
        bgRef,
        minimapRef,
        actionsRef,
        moveImage,
        setMoveImage,
        pendingRef,
        emitMove,
      }}
    >
      {children}
    </roomContext.Provider>
  );
};

export default RoomContextProvider;
