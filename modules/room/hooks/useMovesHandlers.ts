import {
  use,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  type RefObject,
} from 'react';

import { toast } from 'react-toastify';

import { hasModKey, isTypingTarget } from '@/common/lib/keyboard';
import { socket } from '@/common/lib/socket';
import { useBackground } from '@/common/state/background';
import { useOptionsValue, useSetSelection } from '@/common/state/options';
import { useMyMoves, useRoom } from '@/common/state/room';
import { sortMoves } from '@/common/state/room/room.reducers';
import { useSetSavedMoves } from '@/common/state/savedMoves';
import type { Move, Rect } from '@/common/types/global';

import { useRefs } from './useRefs';
import { roomContext, TOAST_OPTIONS } from '../context/Room.context';
import {
  copyToMinimap,
  drawMove,
  drawSelectionOutline,
} from '../modules/board/helpers/Canvas.helpers';
import { useCtx } from '../modules/board/hooks/useCtx';

type ImageMap = Map<string, HTMLImageElement | null>;

interface Scheduled {
  ctx: CanvasRenderingContext2D | null;
  moves: Move[];
  selection: Rect | null;
}

// True when `prefix` is the start of `moves`.
const startsWith = (moves: Move[], prefix: Move[]) =>
  prefix.length <= moves.length && prefix.every((move, index) => moves[index].id === move.id);

// Draws each move alone, so that one bad move does not stop the others.
const drawMoves = (ctx: CanvasRenderingContext2D, moves: Move[], images: ImageMap) => {
  moves.forEach((move) => {
    try {
      drawMove(ctx, move, images.get(move.id));
    } catch (err) {
      console.error('Could not draw a move:', err);
    }
  });
};

export const useMovesHandlers = (drawing: boolean, drawingRef: RefObject<boolean>) => {
  const { canvasRef, minimapRef, bgRef } = useRefs();
  const { pendingRef, emitMove } = use(roomContext);
  const room = useRoom();
  const { handleAddMyMove, handleRemoveMyMove } = useMyMoves();
  const { addSavedMove, removeSavedMove } = useSetSavedMoves();
  const ctx = useCtx();
  const bg = useBackground();
  const { selection } = useOptionsValue();
  const { clearSelection } = useSetSelection();

  const sortedMoves = useMemo(() => sortMoves(room), [room]);

  // Loaded images by move id. A failed image resolves to null.
  const imageCache = useRef(new Map<string, Promise<HTMLImageElement | null>>());
  // Drawing jobs run one after another, so two redraws never mix.
  const drawQueue = useRef<Promise<void>>(Promise.resolve());
  // The state of the last scheduled drawing job.
  const scheduled = useRef<Scheduled>({ ctx: null, moves: [], selection: null });
  const fullRedrawNeeded = useRef(false);

  const copyCanvasToSmall = useCallback(
    () => copyToMinimap(minimapRef.current, bgRef.current, canvasRef.current),
    [bgRef, canvasRef, minimapRef],
  );

  useEffect(() => {
    copyCanvasToSmall();
  }, [bg, copyCanvasToSmall]);

  const loadImages = useCallback(async (moves: Move[]): Promise<ImageMap> => {
    const entries = await Promise.all(
      moves
        .filter((move) => move.options.shape === 'image')
        .map(async (move) => {
          let promise = imageCache.current.get(move.id);
          if (!promise) {
            promise = new Promise((resolve) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = () => resolve(null);
              img.src = move.img.base64;
            });
            imageCache.current.set(move.id, promise);
          }
          return [move.id, await promise] as const;
        }),
    );
    return new Map(entries);
  }, []);

  // Adds a drawing job. The job loads the images first, so that the canvas
  // is never blank while images load. If the user starts a stroke while the
  // images load, the job does not draw: a change to the canvas would damage
  // the stroke preview. The board draws everything again after the stroke.
  const enqueue = useCallback(
    (moves: Move[], draw: (context: CanvasRenderingContext2D, images: ImageMap) => void) => {
      drawQueue.current = drawQueue.current.then(async () => {
        if (!ctx) return;
        const images = await loadImages(moves);
        if (drawingRef.current) {
          fullRedrawNeeded.current = true;
          return;
        }
        try {
          draw(ctx, images);
        } catch (err) {
          console.error('Could not draw the board:', err);
        }
      });
    },
    [ctx, drawingRef, loadImages],
  );

  const redrawAll = useCallback(
    (moves: Move[], currentSelection: Rect | null) => {
      // Forget the images of moves that are not on the board any more.
      const ids = new Set(moves.map((move) => move.id));
      imageCache.current.forEach((_image, id) => {
        if (!ids.has(id)) imageCache.current.delete(id);
      });

      enqueue(moves, (context, images) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        drawMoves(context, moves, images);
        copyCanvasToSmall();
        // Draw the outline after the minimap copy, so the minimap does not show it.
        if (currentSelection) drawSelectionOutline(context, currentSelection);
      });
    },
    [copyCanvasToSmall, enqueue],
  );

  const drawNewMoves = useCallback(
    (moves: Move[]) =>
      enqueue(moves, (context, images) => {
        drawMoves(context, moves, images);
        copyCanvasToSmall();
      }),
    [copyCanvasToSmall, enqueue],
  );

  // Draw only the new moves when moves were added at the end. Draw all moves
  // again for every other change (undo, a user who left, a new selection).
  // Draw nothing while the user draws a stroke.
  useEffect(() => {
    if (!ctx || drawing) return;

    const prev = scheduled.current;
    const sameBase =
      !fullRedrawNeeded.current &&
      prev.ctx === ctx &&
      prev.selection === selection &&
      startsWith(sortedMoves, prev.moves);

    // For example, a user joined or left. The moves did not change.
    if (sameBase && sortedMoves.length === prev.moves.length) return;

    scheduled.current = { ctx, moves: sortedMoves, selection };
    fullRedrawNeeded.current = false;

    // New moves drawn over a selection outline would damage the outline.
    if (sameBase && !selection) drawNewMoves(sortedMoves.slice(prev.moves.length));
    else redrawAll(sortedMoves, selection);
  }, [ctx, drawing, drawNewMoves, redrawAll, selection, sortedMoves]);

  // Draws the last scheduled state again, for example to remove a stroke
  // preview after the server rejected the stroke.
  const redraw = useCallback(
    () => redrawAll(scheduled.current.moves, scheduled.current.selection),
    [redrawAll],
  );

  const undoNow = useCallback(() => {
    const move = handleRemoveMyMove();
    if (!move) return;

    addSavedMove(move);
    socket.emit('undo');
  }, [addSavedMove, handleRemoveMyMove]);

  // The server confirmed or rejected one own move. When no own move is
  // pending, run the undos that waited.
  const settleMove = useCallback(() => {
    const pending = pendingRef.current;
    pending.moves = Math.max(0, pending.moves - 1);
    if (pending.moves) return;

    while (pending.undos > 0) {
      pending.undos -= 1;
      undoNow();
    }
  }, [pendingRef, undoNow]);

  const handleYourMove = useCallback(
    (move: Move) => {
      // The stroke preview is still on the canvas, so draw everything again.
      fullRedrawNeeded.current = true;
      handleAddMyMove(move);
      settleMove();
    },
    [handleAddMyMove, settleMove],
  );

  const handleMoveRejected = useCallback(
    (reason: string) => {
      // Remove the preview of the stroke that the server did not accept.
      redraw();
      settleMove();
      toast.error(reason, { ...TOAST_OPTIONS, toastId: reason });
    },
    [redraw, settleMove],
  );

  const handleUndo = useCallback(() => {
    // The first undo removes an active selection. It is only local.
    if (selection) {
      clearSelection();
      return;
    }
    if (!socket.connected) return;

    // The server undoes its last received move. If an own move is still on
    // its way, the undo waits for it.
    if (pendingRef.current.moves) pendingRef.current.undos += 1;
    else undoNow();
  }, [clearSelection, pendingRef, selection, undoNow]);

  const handleRedo = useCallback(() => {
    if (!socket.connected) return;

    const move = removeSavedMove();
    if (move) emitMove(move);
  }, [emitMove, removeSavedMove]);

  const handleKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (isTypingTarget(e.target) || !hasModKey(e)) return;

    const key = e.key.toLowerCase();
    if (key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
      e.preventDefault();
      handleRedo();
    }
  });

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeyDown(e);
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);

  return { handleUndo, handleRedo, handleYourMove, handleMoveRejected };
};
