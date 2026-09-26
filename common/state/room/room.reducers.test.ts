import { describe, expect, it } from 'vitest';

import { DEFAULT_MOVE } from '@/common/constants/defaultMove';
import type { Move } from '@/common/types/global';

import { createRoom } from './room.atom';
import {
  addMoveToUser,
  addMyMove,
  addUser,
  applySnapshot,
  removeMoveFromUser,
  removeMyMove,
  removeUser,
  sortMoves,
} from './room.reducers';

const move = (id: string, timestamp: number): Move => ({ ...DEFAULT_MOVE, id, timestamp });

describe('room reducers', () => {
  it('never changes the room that they get', () => {
    const room = addUser(createRoom('abcd', 'me'), 'u1', 'Bob');
    const frozenUsers = new Map(room.users);
    const frozenMoves = new Map(room.usersMoves);

    const changed = removeUser(addMoveToUser(room, 'u1', move('m1', 1)), 'u1');

    expect(room.users).toEqual(frozenUsers);
    expect(room.usersMoves).toEqual(frozenMoves);
    expect(changed.users.has('u1')).toBe(false);
    expect(changed.movesWithoutUser.map((m) => m.id)).toEqual(['m1']);
  });

  it('removes the last move of a user and ignores a user with no moves', () => {
    const room = addMoveToUser(addMoveToUser(createRoom(), 'u1', move('a', 1)), 'u1', move('b', 2));

    expect(
      removeMoveFromUser(room, 'u1')
        .usersMoves.get('u1')
        ?.map((m) => m.id),
    ).toEqual(['a']);
    expect(removeMoveFromUser(room, 'nobody')).toBe(room);
  });

  it('adds own moves in order', () => {
    const room = addMyMove(addMyMove(createRoom(), move('a', 1)), move('b', 2));

    expect(room.myMoves.map((m) => m.id)).toEqual(['a', 'b']);
  });

  it('returns the removed own move', () => {
    const room = addMyMove(addMyMove(createRoom(), move('a', 1)), move('b', 2));

    const [next, removed] = removeMyMove(room);
    expect(removed?.id).toBe('b');
    expect(next.myMoves.map((m) => m.id)).toEqual(['a']);
    expect(removeMyMove(createRoom())[1]).toBeUndefined();
  });

  it('applies a snapshot and keeps only the moves of the current connection as own moves', () => {
    const room = addMyMove(createRoom('abcd', 'me'), move('old', 1));

    const next = applySnapshot(
      room,
      {
        drawed: [move('d1', 1)],
        usersMoves: [
          ['me', [move('mine', 2)]],
          ['u1', [move('u1m', 3)]],
        ],
        users: [
          ['me', 'Me'],
          ['u1', 'Bob'],
        ],
      },
      'me',
    );

    expect([...next.users.keys()]).toEqual(['u1']);
    expect([...next.usersMoves.keys()]).toEqual(['u1']);
    expect(next.myMoves.map((m) => m.id)).toEqual(['mine']);
    expect(next.movesWithoutUser.map((m) => m.id)).toEqual(['d1']);
    expect(next.id).toBe('abcd');
    expect(next.username).toBe('me');
  });

  it('sorts all moves by their server timestamp', () => {
    let room = createRoom();
    room = { ...room, movesWithoutUser: [move('c', 3)] };
    room = addMyMove(room, move('a', 1));
    room = addMoveToUser(room, 'u1', move('b', 2));

    expect(sortMoves(room).map((m) => m.id)).toEqual(['a', 'b', 'c']);
  });
});
