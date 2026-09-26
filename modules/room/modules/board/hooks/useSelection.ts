import { use, useCallback, useEffect, useEffectEvent, useMemo } from 'react';

import { toast } from 'react-toastify';

import { hasModKey, isTypingTarget } from '@/common/lib/keyboard';
import { canvasToDataUri } from '@/common/lib/optimizeImage';
import { socket } from '@/common/lib/socket';
import { useOptionsValue, useSetSelection } from '@/common/state/options';

import { useBoardPosition } from './useBoardPosition';
import { roomContext, TOAST_OPTIONS } from '../../../context/Room.context';
import { useMoveImage } from '../../../hooks/useMoveImage';
import { useRefs } from '../../../hooks/useRefs';
import {
  createEraseMove,
  insetRect,
  normalizeRect,
  SELECTION_PADDING,
} from '../helpers/Canvas.helpers';

export const useSelection = () => {
  const { selection } = useOptionsValue();
  const { clearSelection } = useSetSelection();
  const { bgRef, canvasRef, actionsRef } = useRefs();
  const { emitMove } = use(roomContext);
  const { setMoveImage } = useMoveImage();
  const boardPos = useBoardPosition();

  // The selected content, without the padding around it.
  const area = useMemo(
    () => (selection ? insetRect(normalizeRect(selection), SELECTION_PADDING) : null),
    [selection],
  );

  // Copies the selected area to a new canvas.
  const copyArea = useCallback(
    (withBg: boolean) => {
      if (!area || !area.width || !area.height || !canvasRef.current) return null;

      const { x, y, width, height } = area;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const tempCtx = canvas.getContext('2d');
      if (!tempCtx) return null;

      if (withBg && bgRef.current)
        tempCtx.drawImage(bgRef.current, x, y, width, height, 0, 0, width, height);
      tempCtx.drawImage(canvasRef.current, x, y, width, height, 0, 0, width, height);
      return canvas;
    },
    [area, bgRef, canvasRef],
  );

  // Erases the selected area for all users.
  const handleDelete = useCallback(() => {
    if (area && socket.connected) emitMove(createEraseMove(area));
  }, [area, emitMove]);

  const handleCopy = useCallback(async () => {
    const canvas = copyArea(true);
    const blob = canvas && (await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve)));
    if (!blob) return;

    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      toast('Copied to clipboard!', TOAST_OPTIONS);
    } catch {
      toast.error('The browser did not allow access to the clipboard.', TOAST_OPTIONS);
    }
  }, [copyArea]);

  // Shows the selected content as an image that the user can drag. The
  // original content stays until the user places the image, so a cancel or
  // an error loses nothing.
  const handleMove = useCallback(() => {
    if (!area || !socket.connected) return;

    const canvas = copyArea(false);
    if (!canvas) return;

    let base64: string;
    try {
      base64 = canvasToDataUri(canvas);
    } catch {
      toast.error('The selection is too large to move.', TOAST_OPTIONS);
      return;
    }

    clearSelection();
    // MoveImage uses screen positions, and the area uses board positions.
    setMoveImage({
      base64,
      x: area.x + boardPos.x.get(),
      y: area.y + boardPos.y.get(),
      eraseArea: area,
    });
  }, [area, boardPos.x, boardPos.y, clearSelection, copyArea, setMoveImage]);

  useEffect(() => {
    Object.assign(actionsRef.current, {
      moveSelection: handleMove,
      copySelection: handleCopy,
      deleteSelection: handleDelete,
    });
  }, [actionsRef, handleCopy, handleDelete, handleMove]);

  const handleKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (!area || isTypingTarget(e.target)) return;

    if (hasModKey(e) && e.key.toLowerCase() === 'c') handleCopy();
    else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      handleDelete();
    }
  });

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handleKeyDown(e);
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);
};
