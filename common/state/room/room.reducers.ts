// Pure state changes for the room. Each function returns a new room and
// never changes the room that it gets.
import { COLORS_ARRAY } from '@/common/constants/colors';
import { getNextColor } from '@/common/lib/getNextColor';
import type { ClientRoom, Move, RoomSnapshot, User } from '@/common/types/global';

export const applySnapshot = (
  room: ClientRoom,
  snapshot: RoomSnapshot,
  myId: string | undefined,
): ClientRoom => {
  const users = new Map<string, User>();
  snapshot.users.forEach(([userId, name], index) => {
    if (userId !== myId)
      users.set(userId, { name, color: COLORS_ARRAY[index % COLORS_ARRAY.length] });
  });

  return {
    ...room,
    users,
    usersMoves: new Map(snapshot.usersMoves.filter(([userId]) => userId !== myId)),
    movesWithoutUser: snapshot.drawed,
    // The server keeps the moves of this user's earlier connection in
    // `drawed`. Only moves of the current connection are own moves.
    myMoves: snapshot.usersMoves.find(([userId]) => userId === myId)?.[1] ?? [],
  };
};

export const addUser = (room: ClientRoom, userId: string, name: string): ClientRoom => {
  const users = new Map(room.users);
  const color = getNextColor([...users.values()].pop()?.color);
  users.set(userId, { name, color });

  const usersMoves = new Map(room.usersMoves);
  usersMoves.set(userId, []);

  return { ...room, users, usersMoves };
};

export const removeUser = (room: ClientRoom, userId: string): ClientRoom => {
  const users = new Map(room.users);
  users.delete(userId);

  const usersMoves = new Map(room.usersMoves);
  usersMoves.delete(userId);

  return {
    ...room,
    users,
    usersMoves,
    movesWithoutUser: [...room.movesWithoutUser, ...(room.usersMoves.get(userId) ?? [])],
  };
};

export const addMoveToUser = (room: ClientRoom, userId: string, move: Move): ClientRoom => {
  const usersMoves = new Map(room.usersMoves);
  usersMoves.set(userId, [...(room.usersMoves.get(userId) ?? []), move]);
  return { ...room, usersMoves };
};

export const removeMoveFromUser = (room: ClientRoom, userId: string): ClientRoom => {
  const moves = room.usersMoves.get(userId);
  if (!moves?.length) return room;

  const usersMoves = new Map(room.usersMoves);
  usersMoves.set(userId, moves.slice(0, -1));
  return { ...room, usersMoves };
};

// A new move replaces a selection, because a selection is only local.
export const addMyMove = (room: ClientRoom, move: Move): ClientRoom => {
  const last = room.myMoves.at(-1);
  const myMoves =
    last?.options.mode === 'select'
      ? [...room.myMoves.slice(0, -1), move]
      : [...room.myMoves, move];
  return { ...room, myMoves };
};

export const removeMyMove = (room: ClientRoom): [ClientRoom, Move | undefined] => {
  const move = room.myMoves.at(-1);
  if (!move) return [room, undefined];
  return [{ ...room, myMoves: room.myMoves.slice(0, -1) }, move];
};

// All moves in the order in which the server received them.
export const sortMoves = (room: ClientRoom): Move[] => {
  const moves = [...room.movesWithoutUser, ...room.myMoves];
  room.usersMoves.forEach((userMoves) => moves.push(...userMoves));
  return moves.sort((a, b) => a.timestamp - b.timestamp);
};
