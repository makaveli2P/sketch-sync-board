import { use, useEffect, useEffectEvent, useRef, useState } from 'react';

import { motion } from 'motion/react';
import { BsArrowsMove } from 'react-icons/bs';

import { CANVAS_SIZE } from '@/common/constants/canvasSize';
import { useViewportSize } from '@/common/hooks/useViewportSize';
import { socket } from '@/common/lib/socket';

import Background from './Background';
import MiniMap from './Minimap';
import { roomContext } from '../../../context/Room.context';
import { useMovesHandlers } from '../../../hooks/useMovesHandlers';
import { useRefs } from '../../../hooks/useRefs';
import { useBoardPosition } from '../hooks/useBoardPosition';
import { useCtx } from '../hooks/useCtx';
import { useDraw } from '../hooks/useDraw';
import { useSelection } from '../hooks/useSelection';
import { useSocketDraw } from '../hooks/useSocketDraw';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const Canvas = () => {
  const { bgRef, actionsRef } = useRefs();
  const { setCanvas } = use(roomContext);
  const { width, height } = useViewportSize();
  const { x, y } = useBoardPosition();
  const ctx = useCtx();

  // The "Move the board" mode: the left mouse button or a finger moves the board.
  const [dragging, setDragging] = useState(false);
  // The right mouse button moves the board at any time.
  const [panning, setPanning] = useState(false);
  const panStart = useRef<{ pointerX: number; pointerY: number; boardX: number; boardY: number }>(
    null,
  );

  const { handleEndDrawing, handleDraw, handleStartDrawing, drawing, drawingRef } =
    useDraw(dragging);
  const { handleUndo, handleRedo, handleYourMove, handleMoveRejected } = useMovesHandlers(
    drawing,
    drawingRef,
  );
  useSelection();

  useSocketDraw(drawing, drawingRef, {
    onYourMove: handleYourMove,
    onMoveRejected: handleMoveRejected,
  });

  useEffect(() => {
    Object.assign(actionsRef.current, { undo: handleUndo, redo: handleRedo });
  }, [actionsRef, handleRedo, handleUndo]);

  useEffect(() => {
    if (ctx) socket.emit('joined_room');
  }, [ctx]);

  // End the stroke also when the mouse button goes up outside the canvas,
  // for example over the toolbar.
  const endDrawing = useEffectEvent(() => handleEndDrawing());
  useEffect(() => {
    if (!drawing) return undefined;

    const listener = () => endDrawing();
    window.addEventListener('mouseup', listener);
    return () => window.removeEventListener('mouseup', listener);
  }, [drawing]);

  return (
    <div className="relative h-full w-full overflow-clip">
      <motion.canvas
        ref={setCanvas}
        data-testid="board"
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className={`absolute top-0 z-10 ${dragging || panning ? 'cursor-move' : ''}`}
        style={{ x, y }}
        drag={dragging}
        dragConstraints={{
          left: -(CANVAS_SIZE.width - width),
          right: 0,
          top: -(CANVAS_SIZE.height - height),
          bottom: 0,
        }}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' || e.button !== 2) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          panStart.current = {
            pointerX: e.clientX,
            pointerY: e.clientY,
            boardX: x.get(),
            boardY: y.get(),
          };
          setPanning(true);
        }}
        onPointerMove={(e) => {
          const start = panStart.current;
          if (!start) return;
          x.set(clamp(start.boardX + e.clientX - start.pointerX, -(CANVAS_SIZE.width - width), 0));
          y.set(
            clamp(start.boardY + e.clientY - start.pointerY, -(CANVAS_SIZE.height - height), 0),
          );
        }}
        onPointerUp={(e) => {
          if (e.button === 2 && panStart.current)
            e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onLostPointerCapture={() => {
          panStart.current = null;
          setPanning(false);
        }}
        onMouseDown={(e) => {
          if (e.button === 0) handleStartDrawing(e.clientX, e.clientY);
        }}
        onMouseUp={(e) => {
          if (e.button === 0) handleEndDrawing();
        }}
        onMouseMove={(e) => handleDraw(e.clientX, e.clientY, e.shiftKey)}
        onTouchStart={(e) =>
          handleStartDrawing(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
        }
        onTouchEnd={handleEndDrawing}
        onTouchMove={(e) => handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
      />
      <Background bgRef={bgRef} />

      <MiniMap dragging={dragging || panning} />

      <button
        type="button"
        aria-label={dragging ? 'Stop moving the board' : 'Move the board'}
        aria-pressed={dragging}
        className={`absolute right-5 bottom-14 z-10 rounded-xl md:bottom-5 ${
          dragging ? 'bg-green-500' : 'bg-zinc-300 text-black'
        } p-3 text-lg text-white`}
        onClick={() => setDragging((prev) => !prev)}
      >
        <BsArrowsMove />
      </button>
    </div>
  );
};

export default Canvas;
