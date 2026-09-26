import { io, type Socket } from 'socket.io-client';

import { type ClientToServerEvents, type ServerToClientEvents } from '../types/global';

// A random id for this browser tab. After a reconnect, the server uses it to
// remove the tab's old connection from the room.
const clientId =
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

// Unset means same origin (local dev with server/index.ts). Only connect in
// the browser, not during the Next.js build or server rendering.
const url = process.env.NEXT_PUBLIC_SOCKET_URL;
const opts = { autoConnect: typeof window !== 'undefined', auth: { clientId } };

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = url
  ? io(url, opts)
  : io(opts);
