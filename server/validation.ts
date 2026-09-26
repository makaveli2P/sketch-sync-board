// Checks for every payload that a client sends. The server never trusts the
// client: a bad payload must not crash the server or break other clients.
import type { CtxMode, Move, Shape } from '@/common/types/global';

// A relative path, because Node.js runs the compiled server without the "@/" alias.
import {
  MAX_IMAGE_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_USERNAME_LENGTH,
} from '../common/constants/limits';

export { MAX_IMAGE_LENGTH, MAX_MESSAGE_LENGTH, MAX_USERNAME_LENGTH };

export const MAX_PATH_POINTS = 20_000;
export const MAX_LINE_WIDTH = 50;

const ROOM_ID_PATTERN = /^[a-z0-9]{4}$/;
const MODES: ReadonlySet<CtxMode> = new Set(['draw', 'eraser']);
const SHAPES: ReadonlySet<Shape> = new Set(['line', 'circle', 'rect', 'image']);

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const inRange = (value: unknown, min: number, max: number): value is number =>
  isFiniteNumber(value) && value >= min && value <= max;

const parseColor = (value: unknown) => {
  if (!isRecord(value)) return null;
  const { r, g, b, a } = value;
  if (!inRange(r, 0, 255) || !inRange(g, 0, 255) || !inRange(b, 0, 255) || !inRange(a, 0, 1))
    return null;
  return { r, g, b, a };
};

const parsePath = (value: unknown): [number, number][] | null => {
  if (!Array.isArray(value) || !value.length || value.length > MAX_PATH_POINTS) return null;

  const path: [number, number][] = [];
  for (const point of value) {
    if (
      !Array.isArray(point) ||
      point.length !== 2 ||
      !isFiniteNumber(point[0]) ||
      !isFiniteNumber(point[1])
    )
      return null;
    path.push([point[0], point[1]]);
  }
  return path;
};

// Returns the room id in its normal form, or null if it is not a valid id.
export const parseRoomId = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const roomId = value.trim().toLowerCase();
  return ROOM_ID_PATTERN.test(roomId) ? roomId : null;
};

export const parseUsername = (value: unknown): string => {
  const username = typeof value === 'string' ? value.trim().slice(0, MAX_USERNAME_LENGTH) : '';
  return username || 'Anonymous';
};

// Returns the message, or null if the message is empty or not a string.
export const parseMessage = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const msg = value.trim().slice(0, MAX_MESSAGE_LENGTH);
  return msg || null;
};

// Returns a clean copy of the move without the server-owned fields, or null
// if the move is not valid.
export const parseMove = (value: unknown): Omit<Move, 'id' | 'timestamp'> | null => {
  if (!isRecord(value) || !isRecord(value.options)) return null;

  const { options } = value;
  const { mode, shape } = options;
  if (
    typeof mode !== 'string' ||
    !MODES.has(mode as CtxMode) ||
    typeof shape !== 'string' ||
    !SHAPES.has(shape as Shape) ||
    !inRange(options.lineWidth, 1, MAX_LINE_WIDTH)
  )
    return null;

  const lineColor = parseColor(options.lineColor);
  const fillColor = parseColor(options.fillColor);
  const path = parsePath(value.path);
  if (!lineColor || !fillColor || !path) return null;

  const circle = isRecord(value.circle) ? value.circle : {};
  const rect = isRecord(value.rect) ? value.rect : {};
  const img = isRecord(value.img) ? value.img : {};
  if (
    ![circle.cX, circle.cY, rect.width, rect.height].every(isFiniteNumber) ||
    // A negative radius makes the canvas throw an error on every client.
    !inRange(circle.radiusX, 0, Number.MAX_VALUE) ||
    !inRange(circle.radiusY, 0, Number.MAX_VALUE)
  )
    return null;

  let base64 = '';
  if (shape === 'image') {
    if (
      typeof img.base64 !== 'string' ||
      !img.base64.startsWith('data:image/') ||
      img.base64.length > MAX_IMAGE_LENGTH
    )
      return null;
    base64 = img.base64;
  }

  return {
    circle: {
      cX: circle.cX as number,
      cY: circle.cY as number,
      radiusX: circle.radiusX as number,
      radiusY: circle.radiusY as number,
    },
    rect: { width: rect.width as number, height: rect.height as number },
    img: { base64 },
    path,
    options: {
      lineWidth: options.lineWidth,
      lineColor,
      fillColor,
      shape: shape as Shape,
      mode: mode as CtxMode,
      selection: null,
    },
  };
};
