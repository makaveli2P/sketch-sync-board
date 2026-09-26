import { useCallback } from 'react';

import { useAtomValue, useSetAtom, useStore } from 'jotai';

import type { Move, RoomSnapshot } from '@/common/types/global';

import { createRoom, roomAtom } from './room.atom';
import {
  addMoveToUser,
  addMyMove,
  addUser,
  applySnapshot,
  removeMoveFromUser,
  removeMyMove,
  removeUser,
} from './room.reducers';

export const useRoom = () => useAtomValue(roomAtom);

export const useSetRoomId = () => {
  const setRoom = useSetAtom(roomAtom);

  return useCallback(
    (id: string, username: string) => setRoom(createRoom(id, username)),
    [setRoom],
  );
};

export const useResetRoom = () => {
  const setRoom = useSetAtom(roomAtom);

  return useCallback(() => setRoom(createRoom()), [setRoom]);
};

export const useApplySnapshot = () => {
  const setRoom = useSetAtom(roomAtom);

  return useCallback(
    (snapshot: RoomSnapshot, myId: string | undefined) =>
      setRoom((prev) => applySnapshot(prev, snapshot, myId)),
    [setRoom],
  );
};

export const useSetUsers = () => {
  const setRoom = useSetAtom(roomAtom);

  const handleAddUser = useCallback(
    (userId: string, name: string) => setRoom((prev) => addUser(prev, userId, name)),
    [setRoom],
  );

  const handleRemoveUser = useCallback(
    (userId: string) => setRoom((prev) => removeUser(prev, userId)),
    [setRoom],
  );

  const handleAddMoveToUser = useCallback(
    (userId: string, move: Move) => setRoom((prev) => addMoveToUser(prev, userId, move)),
    [setRoom],
  );

  const handleRemoveMoveFromUser = useCallback(
    (userId: string) => setRoom((prev) => removeMoveFromUser(prev, userId)),
    [setRoom],
  );

  return {
    handleAddUser,
    handleRemoveUser,
    handleAddMoveToUser,
    handleRemoveMoveFromUser,
  };
};

export const useMyMoves = () => {
  const store = useStore();

  const handleAddMyMove = useCallback(
    (move: Move) => store.set(roomAtom, (prev) => addMyMove(prev, move)),
    [store],
  );

  // Reads the current state, so two quick undos never remove the same move.
  const handleRemoveMyMove = useCallback(() => {
    const [next, move] = removeMyMove(store.get(roomAtom));
    store.set(roomAtom, next);
    return move;
  }, [store]);

  return { handleAddMyMove, handleRemoveMyMove };
};
