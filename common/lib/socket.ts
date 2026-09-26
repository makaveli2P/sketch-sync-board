import { io, Socket } from 'socket.io-client';

import { ClientToServerEvents, ServerToClientEvents } from '../types/global';

// Unset means same origin (local dev with server/index.ts). Only connect in
// the browser, not during the Next.js build or server rendering.
const url = process.env.NEXT_PUBLIC_SOCKET_URL;
const opts = { autoConnect: typeof window !== 'undefined' };

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = url
  ? io(url, opts)
  : io(opts);
