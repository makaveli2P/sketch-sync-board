import { useEffect, useEffectEvent, useRef, type RefObject } from 'react';

import { socket } from '@/common/lib/socket';
import { useSetUsers } from '@/common/state/room';
import type { Move } from '@/common/types/global';

type BoardEvent =
  | { type: 'draw'; userId: string; move: Move }
  | { type: 'undo'; userId: string }
  | { type: 'your_move'; move: Move }
  | { type: 'rejected'; reason: string };

interface Handlers {
  onYourMove: (move: Move) => void;
  onMoveRejected: (reason: string) => void;
}

// While the user draws, the board shows a preview of the stroke on top of a
// snapshot of the canvas. A change to the canvas during the stroke would get
// lost when the preview restores the snapshot. So the board keeps all move
// events in a queue while the user draws, and applies them in order when the
// stroke ends.
export const useSocketDraw = (
  drawing: boolean,
  drawingRef: RefObject<boolean>,
  { onYourMove, onMoveRejected }: Handlers,
) => {
  const { handleAddMoveToUser, handleRemoveMoveFromUser } = useSetUsers();
  const queue = useRef<BoardEvent[]>([]);

  const applyEvent = useEffectEvent((event: BoardEvent) => {
    switch (event.type) {
      case 'draw':
        handleAddMoveToUser(event.userId, event.move);
        break;
      case 'undo':
        handleRemoveMoveFromUser(event.userId);
        break;
      case 'your_move':
        onYourMove(event.move);
        break;
      case 'rejected':
        onMoveRejected(event.reason);
        break;
      default:
        break;
    }
  });

  const handleEvent = useEffectEvent((event: BoardEvent) => {
    if (drawingRef.current) queue.current.push(event);
    else applyEvent(event);
  });

  useEffect(() => {
    if (drawing) return;

    const events = queue.current;
    queue.current = [];
    events.forEach((event) => applyEvent(event));
  }, [drawing]);

  useEffect(() => {
    const handleUserDraw = (move: Move, userId: string) =>
      handleEvent({ type: 'draw', userId, move });
    const handleUserUndo = (userId: string) => handleEvent({ type: 'undo', userId });
    const handleYourMove = (move: Move) => handleEvent({ type: 'your_move', move });
    const handleRejected = (reason: string) => handleEvent({ type: 'rejected', reason });

    socket.on('user_draw', handleUserDraw);
    socket.on('user_undo', handleUserUndo);
    socket.on('your_move', handleYourMove);
    socket.on('move_rejected', handleRejected);

    return () => {
      socket.off('user_draw', handleUserDraw);
      socket.off('user_undo', handleUserUndo);
      socket.off('your_move', handleYourMove);
      socket.off('move_rejected', handleRejected);
    };
  }, []);
};
