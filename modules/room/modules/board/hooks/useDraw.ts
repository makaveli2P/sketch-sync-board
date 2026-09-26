import { use, useRef, useState } from 'react';

import { DEFAULT_MOVE } from '@/common/constants/defaultMove';
import { useViewportSize } from '@/common/hooks/useViewportSize';
import { getPos } from '@/common/lib/getPos';
import { socket } from '@/common/lib/socket';
import { useOptionsValue, useSetSelection } from '@/common/state/options';
import { useMyMoves } from '@/common/state/room';
import { useSetSavedMoves } from '@/common/state/savedMoves';
import type { Move } from '@/common/types/global';

import { useBoardPosition } from './useBoardPosition';
import { useCtx } from './useCtx';
import { roomContext } from '../../../context/Room.context';
import {
  applyStyle,
  drawCircle,
  drawLine,
  drawRect,
  drawSelectionPreview,
  normalizeRect,
  SELECTION_PADDING,
} from '../helpers/Canvas.helpers';

// A selection smaller than this (in pixels) counts as a click.
const MIN_SELECTION_SIZE = 3;

const emptyStroke = () => ({
  path: [] as [number, number][],
  circle: { cX: 0, cY: 0, radiusX: 0, radiusY: 0 },
  size: { width: 0, height: 0 },
  // The visible part of the canvas when the stroke started.
  snapshot: undefined as ImageData | undefined,
});

export const useDraw = (blocked: boolean) => {
  const options = useOptionsValue();
  const { x: movedX, y: movedY } = useBoardPosition();
  const { clearSavedMoves } = useSetSavedMoves();
  const { handleAddMyMove } = useMyMoves();
  const { setSelection, clearSelection } = useSetSelection();
  const vw = useViewportSize();
  const ctx = useCtx();
  const { emitMove } = use(roomContext);

  const [drawing, setDrawing] = useState(false);
  // The same value as `drawing`, but it changes at once and not at the next
  // render. Socket events and global mouse events read it.
  const drawingRef = useRef(false);
  const stroke = useRef(emptyStroke());

  const setupCtxOptions = () => {
    if (ctx) applyStyle(ctx, options);
  };

  // Puts back the canvas as it was when the stroke started, so that each
  // mouse move draws the preview again from a clean state.
  const restoreSnapshot = () => {
    if (!ctx || !vw.width || !vw.height) return;

    const left = -movedX.get();
    const top = -movedY.get();
    stroke.current.snapshot ??= ctx.getImageData(left, top, vw.width, vw.height);
    ctx.putImageData(stroke.current.snapshot, left, top);
  };

  const handleStartDrawing = (x: number, y: number) => {
    // Without a connection the server cannot receive the stroke. The room
    // shows a "Reconnecting" message.
    if (!ctx || blocked || !socket.connected) return;

    const point: [number, number] = [getPos(x, movedX), getPos(y, movedY)];

    drawingRef.current = true;
    setDrawing(true);
    stroke.current = emptyStroke();
    setupCtxOptions();
    restoreSnapshot();

    if (options.shape === 'line' && options.mode !== 'select') {
      ctx.beginPath();
      ctx.lineTo(...point);
      ctx.stroke();
    }

    stroke.current.path.push(point);
  };

  const handleDraw = (x: number, y: number, shift?: boolean) => {
    if (!ctx || !drawingRef.current || blocked) return;

    const [finalX, finalY] = [getPos(x, movedX), getPos(y, movedY)];
    const current = stroke.current;

    restoreSnapshot();

    if (options.mode === 'select') {
      drawSelectionPreview(ctx, current.path[0], finalX, finalY);
      current.path.push([finalX, finalY]);
      setupCtxOptions();
      return;
    }

    switch (options.shape) {
      case 'line':
        if (shift) current.path = current.path.slice(0, 1);
        drawLine(ctx, current.path[0], finalX, finalY, shift);
        current.path.push([finalX, finalY]);
        break;

      case 'circle':
        current.circle = drawCircle(ctx, current.path[0], finalX, finalY, shift);
        break;

      case 'rect':
        current.size = drawRect(ctx, current.path[0], finalX, finalY, shift);
        break;

      default:
        break;
    }
  };

  const handleEndDrawing = () => {
    if (!ctx || !drawingRef.current) return;

    drawingRef.current = false;
    setDrawing(false);
    ctx.closePath();

    const { path, circle, size } = stroke.current;

    if (options.mode === 'select') {
      // Remove the selection preview.
      restoreSnapshot();
      stroke.current = emptyStroke();

      const [start, end] = [path[0], path.at(-1)];
      const rect =
        start &&
        end &&
        normalizeRect({
          x: start[0],
          y: start[1],
          width: end[0] - start[0],
          height: end[1] - start[1],
        });

      if (!rect || rect.width < MIN_SELECTION_SIZE || rect.height < MIN_SELECTION_SIZE) {
        clearSelection();
        return;
      }

      setSelection({
        x: rect.x - SELECTION_PADDING,
        y: rect.y - SELECTION_PADDING,
        width: rect.width + 2 * SELECTION_PADDING,
        height: rect.height + 2 * SELECTION_PADDING,
      });
      // Undo removes the selection first.
      handleAddMyMove({ ...DEFAULT_MOVE, path, options });
      return;
    }

    if (!socket.connected) {
      // The connection was lost during the stroke. Remove the preview.
      restoreSnapshot();
      stroke.current = emptyStroke();
      return;
    }

    stroke.current = emptyStroke();

    const move: Move = {
      ...DEFAULT_MOVE,
      rect: { ...size },
      circle: { ...circle },
      path,
      options,
    };

    // The stroke stays on the canvas until the server returns it as
    // "your_move". Then the board draws all moves again.
    emitMove(move);
    clearSavedMoves();
  };

  return {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    drawing,
    drawingRef,
  };
};
