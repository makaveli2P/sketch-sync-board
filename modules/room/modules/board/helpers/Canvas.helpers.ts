import { DEFAULT_MOVE } from '@/common/constants/defaultMove';
import { getStringFromRgba } from '@/common/lib/rgba';
import type { CtxOptions, Move, Rect } from '@/common/types/global';

// Space between the selected content and the dashed selection outline.
export const SELECTION_PADDING = 2;

// Returns the same rectangle with a positive width and height.
export const normalizeRect = ({ x, y, width, height }: Rect): Rect => ({
  x: Math.min(x, x + width),
  y: Math.min(y, y + height),
  width: Math.abs(width),
  height: Math.abs(height),
});

// Makes a normalized rectangle smaller by `amount` on each side.
export const insetRect = ({ x, y, width, height }: Rect, amount: number): Rect => ({
  x: x + amount,
  y: y + amount,
  width: Math.max(0, width - 2 * amount),
  height: Math.max(0, height - 2 * amount),
});

const getWidthAndHeight = (x: number, y: number, from: [number, number], shift?: boolean) => {
  let width = x - from[0];
  let height = y - from[1];

  // With Shift, make a square (or a circle).
  if (shift) {
    if (Math.abs(width) > Math.abs(height)) {
      if ((width > 0 && height < 0) || (width < 0 && height > 0)) width = -height;
      else width = height;
    } else if ((height > 0 && width < 0) || (height < 0 && width > 0)) height = -width;
    else height = width;
  }

  return { width, height };
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean,
) => {
  ctx.beginPath();

  const { width, height } = getWidthAndHeight(x, y, from, shift);

  const cX = from[0] + width / 2;
  const cY = from[1] + height / 2;
  const radiusX = Math.abs(width / 2);
  const radiusY = Math.abs(height / 2);

  ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);

  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  return { cX, cY, radiusX, radiusY };
};

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean,
  fill?: boolean,
) => {
  ctx.beginPath();

  const { width, height } = getWidthAndHeight(x, y, from, shift);

  if (fill) ctx.fillRect(from[0], from[1], width, height);
  else ctx.rect(from[0], from[1], width, height);

  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  return { width, height };
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean,
) => {
  if (shift) {
    ctx.beginPath();
    ctx.lineTo(from[0], from[1]);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    return;
  }

  ctx.lineTo(x, y);
  ctx.stroke();
};

// Sets the line and fill style of the context for the given options.
export const applyStyle = (ctx: CanvasRenderingContext2D, options: CtxOptions) => {
  ctx.lineWidth = options.lineWidth;
  ctx.strokeStyle = getStringFromRgba(options.lineColor);
  ctx.fillStyle = getStringFromRgba(options.fillColor);
  ctx.globalCompositeOperation = options.mode === 'eraser' ? 'destination-out' : 'source-over';
};

// Draws the gray area that shows the selection while the user drags.
export const drawSelectionPreview = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
) => {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  drawRect(ctx, from, x, y, false, true);
};

// A move that erases a board area for all users.
export const createEraseMove = (area: Rect): Move => ({
  ...DEFAULT_MOVE,
  rect: { width: area.width, height: area.height },
  path: [[area.x, area.y]],
  options: {
    ...DEFAULT_MOVE.options,
    shape: 'rect',
    mode: 'eraser',
    // Erase only with the fill. A visible outline would also erase outside
    // the area.
    lineColor: { r: 0, g: 0, b: 0, a: 0 },
    fillColor: { r: 0, g: 0, b: 0, a: 1 },
  },
});

// Draws one stored move. Image moves need their loaded image.
export const drawMove = (
  ctx: CanvasRenderingContext2D,
  move: Move,
  image?: HTMLImageElement | null,
) => {
  const { path, options } = move;
  if (!path.length || options.mode === 'select') return;

  applyStyle(ctx, options);

  switch (options.shape) {
    case 'image':
      if (image) ctx.drawImage(image, path[0][0], path[0][1]);
      break;

    case 'line':
      ctx.beginPath();
      path.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.stroke();
      ctx.closePath();
      break;

    case 'circle': {
      const { cX, cY, radiusX, radiusY } = move.circle;
      ctx.beginPath();
      ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
      break;
    }

    case 'rect':
      ctx.beginPath();
      ctx.rect(path[0][0], path[0][1], move.rect.width, move.rect.height);
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
      break;

    default:
      break;
  }
};

// Draws the background and the board into the minimap at its own size. The
// minimap canvas has its display size: a full-size canvas that CSS makes
// smaller would drop thin lines.
export const copyToMinimap = (
  minimap: HTMLCanvasElement | null,
  bg: HTMLCanvasElement | null,
  board: HTMLCanvasElement | null,
) => {
  const ctx = minimap?.getContext('2d');
  if (!ctx || !bg || !board) return;

  const { width, height } = ctx.canvas;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(bg, 0, 0, width, height);
  ctx.drawImage(board, 0, 0, width, height);
};

export const drawSelectionOutline = (ctx: CanvasRenderingContext2D, selection: Rect) => {
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';
  ctx.setLineDash([5, 10]);
  ctx.globalCompositeOperation = 'source-over';

  ctx.beginPath();
  ctx.rect(selection.x, selection.y, selection.width, selection.height);
  ctx.stroke();
  ctx.closePath();

  ctx.setLineDash([]);
};
