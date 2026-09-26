import type { Server as HttpServer } from 'node:http';

import { Server } from 'socket.io';

import type { ClientToServerEvents, ServerToClientEvents } from '@/common/types/global';

import { RoomStore, type RoomStoreOptions } from './rooms';
import {
  isFiniteNumber,
  MAX_IMAGE_LENGTH,
  parseMessage,
  parseMove,
  parseRoomId,
  parseUsername,
} from './validation';

// Room creation limit for one connection.
const CREATE_ROOM_LIMIT = 10;
const CREATE_ROOM_WINDOW_MS = 60 * 1000;

export interface SocketOptions {
  // Allowed browser origins. Leave it out when the page and the socket have
  // the same origin.
  corsOrigins?: (string | RegExp)[];
  // Set to false when another handler (for example Next.js hot reload) also
  // uses WebSocket upgrades on the same HTTP server.
  destroyUpgrade?: boolean;
  rooms?: Partial<RoomStoreOptions>;
}

type Handler = (...args: never[]) => void;

export const attachSocket = (server: HttpServer, options: SocketOptions = {}) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: options.corsOrigins ? { origin: options.corsOrigins } : undefined,
    destroyUpgrade: options.destroyUpgrade ?? true,
    // Room image moves are data URIs. Allow them plus some protocol overhead.
    maxHttpBufferSize: MAX_IMAGE_LENGTH + 100_000,
  });
  const store = new RoomStore(options.rooms);

  // Each browser tab sends a random id. When a tab reconnects, the server can
  // still have the tab's old connection, because it notices a lost
  // connection only after the ping timeout. The old connection must not stay
  // in the room as a second copy of the user.
  const removeOldConnections = (targetRoomId: string, clientId: string, socketId: string) => {
    io.sockets.adapter.rooms.get(targetRoomId)?.forEach((otherId) => {
      const other = io.sockets.sockets.get(otherId);
      if (other && otherId !== socketId && other.data.clientId === clientId) other.disconnect(true);
    });
  };

  io.on('connection', (socket) => {
    const { clientId } = socket.handshake.auth as { clientId?: unknown };
    socket.data.clientId =
      typeof clientId === 'string' && clientId ? clientId.slice(0, 64) : socket.id;

    // Each socket is in at most one room.
    let roomId: string | null = null;
    const createTimes: number[] = [];
    // True after the other users heard about this join, so that a repeated
    // "joined_room" does not announce the user again.
    let announced = false;

    // An error in one handler must not stop the process.
    const on = <E extends keyof ClientToServerEvents>(event: E, handler: Handler) => {
      socket.on(event, ((...args: never[]) => {
        try {
          handler(...args);
        } catch (err) {
          console.error(`[socket] "${event}" handler failed:`, err);
        }
      }) as never);
    };

    const leaveCurrentRoom = () => {
      if (!roomId) return;

      const leftRoomId = roomId;
      roomId = null;
      announced = false;
      store.leave(leftRoomId, socket.id);
      socket.leave(leftRoomId);
      io.to(leftRoomId).emit('user_disconnected', socket.id);
    };

    on('create_room', (username: unknown) => {
      leaveCurrentRoom();

      const now = Date.now();
      while (createTimes.length && now - createTimes[0] > CREATE_ROOM_WINDOW_MS)
        createTimes.shift();
      if (createTimes.length >= CREATE_ROOM_LIMIT) {
        socket.emit('created', '');
        return;
      }
      createTimes.push(now);

      const newRoomId = store.create(socket.id, parseUsername(username));
      if (!newRoomId) {
        socket.emit('created', '');
        return;
      }

      roomId = newRoomId;
      socket.join(newRoomId);
      socket.emit('created', newRoomId);
    });

    on('check_room', (id: unknown) => {
      socket.emit('room_exists', store.has(parseRoomId(id)));
    });

    on('join_room', (id: unknown, username: unknown) => {
      const joinRoomId = parseRoomId(id);
      leaveCurrentRoom();
      if (joinRoomId) removeOldConnections(joinRoomId, socket.data.clientId, socket.id);

      if (!joinRoomId || store.join(joinRoomId, socket.id, parseUsername(username)) !== 'ok') {
        socket.emit('joined', joinRoomId ?? '', true);
        return;
      }

      roomId = joinRoomId;
      socket.join(joinRoomId);
      socket.emit('joined', joinRoomId);
    });

    on('joined_room', () => {
      const snapshot = roomId && store.snapshot(roomId);
      if (!roomId || !snapshot) return;

      socket.emit('room', snapshot);
      if (announced) return;

      announced = true;
      socket
        .to(roomId)
        .emit('new_user', socket.id, store.username(roomId, socket.id) ?? 'Anonymous');
    });

    on('leave_room', () => leaveCurrentRoom());

    on('draw', (rawMove: unknown) => {
      if (!roomId) {
        socket.emit('move_rejected', 'You are not connected to a room.');
        return;
      }

      const parsed = parseMove(rawMove);
      if (!parsed) {
        socket.emit('move_rejected', 'The server could not accept this drawing.');
        return;
      }

      const move = store.addMove(roomId, socket.id, parsed);
      if (!move) {
        socket.emit('move_rejected', 'This room has too many drawings.');
        return;
      }

      socket.emit('your_move', move);
      socket.to(roomId).emit('user_draw', move, socket.id);
    });

    on('undo', () => {
      if (roomId && store.undo(roomId, socket.id)) socket.to(roomId).emit('user_undo', socket.id);
    });

    on('mouse_move', (x: unknown, y: unknown) => {
      if (!roomId || !isFiniteNumber(x) || !isFiniteNumber(y)) return;

      // A lost cursor position does not matter, so do not buffer it.
      socket.to(roomId).volatile.emit('mouse_moved', x, y, socket.id);
    });

    on('send_msg', (rawMsg: unknown) => {
      const msg = parseMessage(rawMsg);
      if (roomId && msg) io.to(roomId).emit('new_msg', socket.id, msg);
    });

    socket.on('disconnecting', () => leaveCurrentRoom());
  });

  return { io, store };
};
