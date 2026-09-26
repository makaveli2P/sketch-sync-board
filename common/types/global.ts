import type { RgbaColor } from 'react-colorful';

export type Shape = 'line' | 'circle' | 'rect' | 'image';
export type CtxMode = 'eraser' | 'draw' | 'select';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CtxOptions {
  lineWidth: number;
  lineColor: RgbaColor;
  fillColor: RgbaColor;
  shape: Shape;
  mode: CtxMode;
  selection: Rect | null;
}

export interface Move {
  circle: {
    cX: number;
    cY: number;
    radiusX: number;
    radiusY: number;
  };
  rect: {
    width: number;
    height: number;
  };
  img: {
    base64: string;
  };
  path: [number, number][];
  options: CtxOptions;
  timestamp: number;
  id: string;
}

// The full state of a room, sent to a user when they join it.
export interface RoomSnapshot {
  // Moves of users who left the room.
  drawed: Move[];
  usersMoves: [userId: string, moves: Move[]][];
  users: [userId: string, username: string][];
}

export interface User {
  name: string;
  color: string;
}

export interface ClientRoom {
  id: string;
  // The name this client joined with. Used to join again after a reconnect.
  username: string;
  usersMoves: Map<string, Move[]>;
  movesWithoutUser: Move[];
  myMoves: Move[];
  users: Map<string, User>;
}

export interface MessageType {
  userId: string;
  username: string;
  color: string;
  msg: string;
  id: number;
}

export interface ServerToClientEvents {
  room_exists: (exists: boolean) => void;
  joined: (roomId: string, failed?: boolean) => void;
  room: (room: RoomSnapshot) => void;
  // An empty roomId means that the server could not create a room.
  created: (roomId: string) => void;
  your_move: (move: Move) => void;
  move_rejected: (reason: string) => void;
  user_draw: (move: Move, userId: string) => void;
  user_undo: (userId: string) => void;
  mouse_moved: (x: number, y: number, userId: string) => void;
  new_user: (userId: string, username: string) => void;
  user_disconnected: (userId: string) => void;
  new_msg: (userId: string, msg: string) => void;
}

export interface ClientToServerEvents {
  check_room: (roomId: string) => void;
  draw: (move: Move) => void;
  mouse_move: (x: number, y: number) => void;
  undo: () => void;
  create_room: (username: string) => void;
  join_room: (room: string, username: string) => void;
  joined_room: () => void;
  leave_room: () => void;
  send_msg: (msg: string) => void;
}
