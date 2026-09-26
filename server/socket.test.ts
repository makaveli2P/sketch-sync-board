import { createServer, type Server as HttpServer } from 'node:http';
import type { AddressInfo } from 'node:net';

import { io as connect, type Socket } from 'socket.io-client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_MOVE } from '@/common/constants/defaultMove';
import type {
  ClientToServerEvents,
  Move,
  RoomSnapshot,
  ServerToClientEvents,
} from '@/common/types/global';

import { attachSocket } from './socket';

type Client = Socket<ServerToClientEvents, ClientToServerEvents>;

const ORIGIN = 'https://board.example';
const line: Move = {
  ...DEFAULT_MOVE,
  path: [
    [1, 1],
    [5, 5],
  ],
  options: { ...DEFAULT_MOVE.options, lineColor: { r: 0, g: 0, b: 0, a: 1 } },
};

let httpServer: HttpServer;
let url: string;
let close: () => void;
const clients: Client[] = [];

const client = async (clientId?: string) => {
  const socket: Client = connect(url, {
    transports: ['websocket'],
    reconnection: false,
    auth: clientId ? { clientId } : {},
  });
  clients.push(socket);
  await new Promise<void>((resolve) => socket.on('connect', resolve));
  return socket;
};

// Waits for one event and returns its arguments.
const next = <E extends keyof ServerToClientEvents>(socket: Client, event: E) =>
  new Promise<Parameters<ServerToClientEvents[E]>>((resolve) => {
    socket.once(event, ((...args: Parameters<ServerToClientEvents[E]>) => resolve(args)) as never);
  });

const createRoom = async (socket: Client, name: string) => {
  const created = next(socket, 'created');
  socket.emit('create_room', name);
  const [roomId] = await created;
  return roomId;
};

const joinRoom = async (socket: Client, roomId: string, name: string) => {
  const joined = next(socket, 'joined');
  socket.emit('join_room', roomId, name);
  return joined;
};

beforeEach(async () => {
  httpServer = createServer();
  const { io, store } = attachSocket(httpServer, { corsOrigins: [ORIGIN] });
  close = () => {
    store.close();
    io.close();
  };
  await new Promise<void>((resolve) => httpServer.listen(0, resolve));
  url = `http://localhost:${(httpServer.address() as AddressInfo).port}`;
});

afterEach(() => {
  clients.splice(0).forEach((socket) => socket.disconnect());
  close();
});

describe('socket server', () => {
  it('stays up after bad events from a client that is in no room', async () => {
    const socket = await client();

    const rejected = next(socket, 'move_rejected');
    socket.emit('draw', line);
    socket.emit('undo');
    socket.emit('draw', null as unknown as Move);
    socket.emit('mouse_move', Number.NaN, 1);
    socket.emit('send_msg', { not: 'text' } as unknown as string);
    socket.emit('join_room', { bad: true } as unknown as string, 'x');
    await rejected;

    // The server still answers.
    const exists = next(socket, 'room_exists');
    socket.emit('check_room', 'zzzz');
    expect(await exists).toEqual([false]);
  });

  it('rejects an invalid move from a user in a room', async () => {
    const socket = await client();
    await createRoom(socket, 'Alice');

    const rejected = next(socket, 'move_rejected');
    socket.emit('draw', { ...line, path: [] });
    expect((await rejected)[0]).toMatch(/could not accept/);
  });

  it('sends moves, undos and messages to the other users in the room', async () => {
    const alice = await client();
    const bob = await client();
    const roomId = await createRoom(alice, 'Alice');
    expect(await joinRoom(bob, roomId, 'Bob')).toEqual([roomId]);

    const newUser = next(alice, 'new_user');
    bob.emit('joined_room');
    expect(await newUser).toEqual([bob.id, 'Bob']);

    const yourMove = next(alice, 'your_move');
    const userDraw = next(bob, 'user_draw');
    alice.emit('draw', line);
    const [stored] = await yourMove;
    const [received, fromUser] = await userDraw;
    expect(received).toEqual(stored);
    expect(fromUser).toBe(alice.id);

    const userUndo = next(bob, 'user_undo');
    alice.emit('undo');
    expect(await userUndo).toEqual([alice.id]);

    const msg = next(alice, 'new_msg');
    bob.emit('send_msg', ' hello ');
    expect(await msg).toEqual([bob.id, 'hello']);
  });

  it('announces a user only once when the client sends "joined_room" again', async () => {
    const alice = await client();
    const bob = await client();
    const roomId = await createRoom(alice, 'Alice');
    await joinRoom(bob, roomId, 'Bob');

    let announcements = 0;
    alice.on('new_user', () => {
      announcements += 1;
    });
    const rooms = [next(bob, 'room')];
    bob.emit('joined_room');
    await rooms[0];
    rooms.push(next(bob, 'room'));
    bob.emit('joined_room');
    await rooms[1];
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(announcements).toBe(1);
  });

  it('sends each move only once to a user who joins after the author left', async () => {
    const alice = await client();
    const roomId = await createRoom(alice, 'Alice');
    const drawn = next(alice, 'your_move');
    alice.emit('draw', line);
    await drawn;
    alice.emit('leave_room');

    const bob = await client();
    await joinRoom(bob, roomId, 'Bob');
    const room = next(bob, 'room');
    bob.emit('joined_room');
    const [snapshot] = (await room) as [RoomSnapshot];

    const allMoves = [...snapshot.drawed, ...snapshot.usersMoves.flatMap(([, moves]) => moves)];
    expect(allMoves).toHaveLength(1);
  });

  it('keeps a socket in only one room', async () => {
    const alice = await client();
    const first = await createRoom(alice, 'Alice');
    const bob = await client();
    await joinRoom(bob, first, 'Bob');

    const left = next(bob, 'user_disconnected');
    const second = await createRoom(alice, 'Alice');
    expect(await left).toEqual([alice.id]);
    expect(second).not.toBe(first);

    // A move from Alice now goes only to her new room.
    let bobGotMove = false;
    bob.on('user_draw', () => {
      bobGotMove = true;
    });
    const yourMove = next(alice, 'your_move');
    alice.emit('draw', line);
    await yourMove;
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(bobGotMove).toBe(false);
  });

  it('replaces the old connection of a tab that joins the room again', async () => {
    const alice = await client();
    const roomId = await createRoom(alice, 'Alice');
    const oldBob = await client('tab-1');
    const oldBobId = oldBob.id;
    await joinRoom(oldBob, roomId, 'Bob');

    // The same tab reconnects before the server noticed the lost connection.
    const oldBobClosed = new Promise((resolve) => oldBob.on('disconnect', resolve));
    const bobLeft = next(alice, 'user_disconnected');
    const newBob = await client('tab-1');
    expect(await joinRoom(newBob, roomId, 'Bob')).toEqual([roomId]);

    await oldBobClosed;
    expect(await bobLeft).toEqual([oldBobId]);
    const room = next(newBob, 'room');
    newBob.emit('joined_room');
    const [snapshot] = (await room) as [RoomSnapshot];
    expect(snapshot.users.map(([, name]) => name).sort()).toEqual(['Alice', 'Bob']);
  });

  it('limits how many rooms one connection can create', async () => {
    const socket = await client();

    const ids: string[] = [];
    for (let i = 0; i < 11; i += 1) ids.push(await createRoom(socket, 'Alice'));

    expect(ids.slice(0, 10).every(Boolean)).toBe(true);
    expect(ids[10]).toBe('');
  });

  it('allows only the configured origin for HTTP polling', async () => {
    const handshake = (origin: string) =>
      fetch(`${url}/socket.io/?EIO=4&transport=polling`, { headers: { Origin: origin } });

    const allowed = await handshake(ORIGIN);
    const other = await handshake('https://evil.example');

    expect(allowed.headers.get('access-control-allow-origin')).toBe(ORIGIN);
    expect(other.headers.get('access-control-allow-origin')).toBeNull();
  });
});
