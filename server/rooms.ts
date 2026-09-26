import { randomInt, randomUUID } from 'node:crypto';

import type { Move, RoomSnapshot } from '@/common/types/global';

export interface RoomStoreOptions {
  maxRooms: number;
  maxUsersPerRoom: number;
  maxMovesPerRoom: number;
  // Memory limits, in bytes of move data (mostly image data URIs).
  maxBytesPerRoom: number;
  maxTotalBytes: number;
  // How long an empty room stays, so that its users can join it again
  // (for example after a reconnect or a page reload).
  emptyRoomTtlMs: number;
  // The same for an empty room with no drawings. It is shorter, because
  // such a room has nothing to keep.
  emptyBlankRoomTtlMs: number;
}

export const DEFAULT_ROOM_STORE_OPTIONS: RoomStoreOptions = {
  maxRooms: 500,
  maxUsersPerRoom: 12,
  maxMovesPerRoom: 10_000,
  maxBytesPerRoom: 20_000_000,
  // The free Render instance has 512 MB of memory.
  maxTotalBytes: 250_000_000,
  emptyRoomTtlMs: 10 * 60 * 1000,
  emptyBlankRoomTtlMs: 30 * 1000,
};

interface Room {
  users: Map<string, string>;
  usersMoves: Map<string, Move[]>;
  // Moves of users who left the room.
  drawed: Move[];
  moveCount: number;
  bytes: number;
  deleteTimer?: NodeJS.Timeout;
}

export type JoinResult = 'ok' | 'not_found' | 'full';

const ROOM_ID_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const ROOM_ID_LENGTH = 4;

const createRoomId = () =>
  Array.from({ length: ROOM_ID_LENGTH }, () => ROOM_ID_CHARS[randomInt(ROOM_ID_CHARS.length)]).join(
    '',
  );

// An estimate of the memory that a move uses.
export const moveSize = (move: Omit<Move, 'id' | 'timestamp'>) =>
  move.img.base64.length + move.path.length * 16 + 200;

// Keeps all rooms in memory. A server restart removes all rooms.
export class RoomStore {
  private readonly rooms = new Map<string, Room>();

  private totalBytes = 0;

  private readonly options: RoomStoreOptions;

  constructor(options: Partial<RoomStoreOptions> = {}) {
    this.options = { ...DEFAULT_ROOM_STORE_OPTIONS, ...options };
  }

  get size() {
    return this.rooms.size;
  }

  has(roomId: string | null): boolean {
    return roomId !== null && this.rooms.has(roomId);
  }

  // Creates a room and adds the user to it. Returns null if the server
  // already has the maximum number of rooms.
  create(socketId: string, username: string): string | null {
    if (this.rooms.size >= this.options.maxRooms) return null;

    let roomId: string;
    do {
      roomId = createRoomId();
    } while (this.rooms.has(roomId));

    this.rooms.set(roomId, {
      users: new Map([[socketId, username]]),
      usersMoves: new Map([[socketId, []]]),
      drawed: [],
      moveCount: 0,
      bytes: 0,
    });
    return roomId;
  }

  join(roomId: string, socketId: string, username: string): JoinResult {
    const room = this.rooms.get(roomId);
    if (!room) return 'not_found';
    if (room.users.size >= this.options.maxUsersPerRoom) return 'full';

    clearTimeout(room.deleteTimer);
    room.deleteTimer = undefined;
    room.users.set(socketId, username);
    room.usersMoves.set(socketId, []);
    return 'ok';
  }

  leave(roomId: string, socketId: string): void {
    const room = this.rooms.get(roomId);
    if (!room?.users.has(socketId)) return;

    room.drawed.push(...(room.usersMoves.get(socketId) ?? []));
    room.usersMoves.delete(socketId);
    room.users.delete(socketId);

    if (!room.users.size) {
      const ttl = room.moveCount ? this.options.emptyRoomTtlMs : this.options.emptyBlankRoomTtlMs;
      room.deleteTimer = setTimeout(() => this.delete(roomId), ttl);
      room.deleteTimer.unref();
    }
  }

  // Adds the move to the user's moves. Returns the stored move with its
  // server id and timestamp, or null if the user is not in the room or a
  // limit does not allow the move.
  addMove(roomId: string, socketId: string, move: Omit<Move, 'id' | 'timestamp'>): Move | null {
    const room = this.rooms.get(roomId);
    const userMoves = room?.usersMoves.get(socketId);
    if (!room || !userMoves) return null;

    const size = moveSize(move);
    if (
      room.moveCount >= this.options.maxMovesPerRoom ||
      room.bytes + size > this.options.maxBytesPerRoom ||
      this.totalBytes + size > this.options.maxTotalBytes
    )
      return null;

    const stored: Move = { ...move, id: randomUUID(), timestamp: Date.now() };
    userMoves.push(stored);
    room.moveCount += 1;
    room.bytes += size;
    this.totalBytes += size;
    return stored;
  }

  // Removes the user's last move. Returns false if there is no move to remove.
  undo(roomId: string, socketId: string): boolean {
    const room = this.rooms.get(roomId);
    const removed = room?.usersMoves.get(socketId)?.pop();
    if (!room || !removed) return false;

    const size = moveSize(removed);
    room.moveCount -= 1;
    room.bytes -= size;
    this.totalBytes -= size;
    return true;
  }

  username(roomId: string, socketId: string): string | undefined {
    return this.rooms.get(roomId)?.users.get(socketId);
  }

  snapshot(roomId: string): RoomSnapshot | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    return {
      drawed: room.drawed,
      usersMoves: [...room.usersMoves],
      users: [...room.users],
    };
  }

  private delete(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    clearTimeout(room.deleteTimer);
    this.totalBytes -= room.bytes;
    this.rooms.delete(roomId);
  }

  // Stops all timers. Tests use this to end cleanly.
  close(): void {
    [...this.rooms.keys()].forEach((roomId) => this.delete(roomId));
  }
}
