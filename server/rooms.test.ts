import { afterEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_MOVE } from '@/common/constants/defaultMove';

import { RoomStore } from './rooms';

const move = { ...DEFAULT_MOVE, path: [[1, 1]] as [number, number][] };

describe('RoomStore', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates a room with a 4-character id and adds the creator', () => {
    const store = new RoomStore();
    const roomId = store.create('a', 'Alice');

    expect(roomId).toMatch(/^[a-z0-9]{4}$/);
    expect(store.username(roomId!, 'a')).toBe('Alice');
    store.close();
  });

  it('gives each move a server id and timestamp', () => {
    const store = new RoomStore();
    const roomId = store.create('a', 'Alice')!;

    const stored = store.addMove(roomId, 'a', move);

    expect(stored?.id).toMatch(/[0-9a-f-]{36}/);
    expect(stored?.timestamp).toBeGreaterThan(0);
    store.close();
  });

  it('does not accept a move from a user who is not in the room', () => {
    const store = new RoomStore();
    const roomId = store.create('a', 'Alice')!;

    expect(store.addMove(roomId, 'stranger', move)).toBeNull();
    expect(store.addMove('none', 'a', move)).toBeNull();
    expect(store.undo(roomId, 'stranger')).toBe(false);
    store.close();
  });

  it('moves the moves of a user who leaves to "drawed" exactly once', () => {
    const store = new RoomStore();
    const roomId = store.create('a', 'Alice')!;
    store.join(roomId, 'b', 'Bob');
    store.addMove(roomId, 'a', move);
    store.addMove(roomId, 'a', move);

    store.leave(roomId, 'a');
    store.leave(roomId, 'a');
    const snapshot = store.snapshot(roomId)!;

    expect(snapshot.drawed).toHaveLength(2);
    expect(snapshot.usersMoves).toEqual([['b', []]]);
    expect(snapshot.users).toEqual([['b', 'Bob']]);
    store.close();
  });

  it('refuses a user when the room is full', () => {
    const store = new RoomStore({ maxUsersPerRoom: 2 });
    const roomId = store.create('a', 'Alice')!;

    expect(store.join(roomId, 'b', 'Bob')).toBe('ok');
    expect(store.join(roomId, 'c', 'Carol')).toBe('full');
    expect(store.join('none', 'c', 'Carol')).toBe('not_found');
    store.close();
  });

  it('deletes an empty room after the time limit, unless a user joins again', () => {
    vi.useFakeTimers();
    const store = new RoomStore({ emptyRoomTtlMs: 1000, emptyBlankRoomTtlMs: 1000 });
    const kept = store.create('a', 'Alice')!;
    const deleted = store.create('b', 'Bob')!;

    store.leave(kept, 'a');
    store.leave(deleted, 'b');
    vi.advanceTimersByTime(500);
    store.join(kept, 'a2', 'Alice');
    vi.advanceTimersByTime(600);

    expect(store.has(kept)).toBe(true);
    expect(store.has(deleted)).toBe(false);
    store.close();
  });

  it('keeps an empty room with drawings longer than an empty room without drawings', () => {
    vi.useFakeTimers();
    const store = new RoomStore({ emptyRoomTtlMs: 10_000, emptyBlankRoomTtlMs: 1000 });
    const drawn = store.create('a', 'Alice')!;
    const blank = store.create('b', 'Bob')!;
    store.addMove(drawn, 'a', move);

    store.leave(drawn, 'a');
    store.leave(blank, 'b');
    vi.advanceTimersByTime(2000);

    expect(store.has(blank)).toBe(false);
    expect(store.has(drawn)).toBe(true);
    store.close();
  });

  it('limits the move data for each room and for the whole server', () => {
    vi.useFakeTimers();
    // Each move below uses 1216 bytes (see moveSize).
    const image = { ...move, img: { base64: 'x'.repeat(1000) } };
    const store = new RoomStore({ maxBytesPerRoom: 2500, maxTotalBytes: 4000, emptyRoomTtlMs: 5 });
    const first = store.create('a', 'Alice')!;
    const second = store.create('b', 'Bob')!;

    expect(store.addMove(first, 'a', image)).not.toBeNull();
    expect(store.addMove(first, 'a', image)).not.toBeNull();
    // The room budget is full.
    expect(store.addMove(first, 'a', image)).toBeNull();
    expect(store.addMove(second, 'b', image)).not.toBeNull();
    // The server budget is full, although the room budget is not.
    expect(store.addMove(second, 'b', image)).toBeNull();

    // An undo gives the memory back.
    expect(store.undo(second, 'b')).toBe(true);
    expect(store.addMove(second, 'b', image)).not.toBeNull();
    expect(store.addMove(second, 'b', image)).toBeNull();

    // A deleted room gives its memory back.
    store.leave(first, 'a');
    vi.advanceTimersByTime(10);
    expect(store.has(first)).toBe(false);
    expect(store.addMove(second, 'b', image)).not.toBeNull();
    store.close();
  });

  it('limits the number of rooms and moves', () => {
    const store = new RoomStore({ maxRooms: 1, maxMovesPerRoom: 1 });
    const roomId = store.create('a', 'Alice')!;

    expect(store.create('b', 'Bob')).toBeNull();
    expect(store.addMove(roomId, 'a', move)).not.toBeNull();
    expect(store.addMove(roomId, 'a', move)).toBeNull();
    expect(store.undo(roomId, 'a')).toBe(true);
    expect(store.addMove(roomId, 'a', move)).not.toBeNull();
    store.close();
  });
});
