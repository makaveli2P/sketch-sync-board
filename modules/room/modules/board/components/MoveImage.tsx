import { use, useEffect } from 'react';

import { motion, useMotionValue } from 'motion/react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

import { DEFAULT_MOVE } from '@/common/constants/defaultMove';
import { useSocketConnected } from '@/common/hooks/useSocketConnected';
import { getPos } from '@/common/lib/getPos';
import type { Move } from '@/common/types/global';

import { roomContext } from '../../../context/Room.context';
import { useMoveImage } from '../../../hooks/useMoveImage';
import { createEraseMove } from '../helpers/Canvas.helpers';
import { useBoardPosition } from '../hooks/useBoardPosition';

const DEFAULT_POSITION = 50;

const MoveImage = () => {
  const { x, y } = useBoardPosition();
  const { moveImage, setMoveImage } = useMoveImage();
  const { emitMove } = use(roomContext);
  const connected = useSocketConnected();

  const imageX = useMotionValue(moveImage.x ?? DEFAULT_POSITION);
  const imageY = useMotionValue(moveImage.y ?? DEFAULT_POSITION);

  useEffect(() => {
    imageX.set(moveImage.x ?? DEFAULT_POSITION);
    imageY.set(moveImage.y ?? DEFAULT_POSITION);
  }, [imageX, imageY, moveImage.x, moveImage.y]);

  const handlePlaceImage = () => {
    const move: Move = {
      ...DEFAULT_MOVE,
      img: { base64: moveImage.base64 },
      path: [[getPos(imageX.get(), x), getPos(imageY.get(), y)]],
      options: { ...DEFAULT_MOVE.options, shape: 'image' },
    };

    // For a moved selection, erase the original area first. The server
    // keeps the order, so the image goes on top.
    if (moveImage.eraseArea) emitMove(createEraseMove(moveImage.eraseArea));
    emitMove(move);
    setMoveImage({ base64: '' });
  };

  if (!moveImage.base64) return null;

  return (
    <motion.div
      drag
      dragElastic={0}
      dragTransition={{ power: 0.03, timeConstant: 50 }}
      className="absolute top-0 z-20 cursor-grab"
      style={{ x: imageX, y: imageY }}
    >
      <div className="absolute bottom-full mb-2 flex gap-3">
        <button
          type="button"
          aria-label="Place the image"
          className="rounded-full bg-gray-200 p-2 disabled:opacity-50"
          disabled={!connected}
          onClick={handlePlaceImage}
        >
          <AiOutlineCheck />
        </button>
        <button
          type="button"
          aria-label="Cancel"
          className="rounded-full bg-gray-200 p-2"
          onClick={() => setMoveImage({ base64: '' })}
        >
          <AiOutlineClose />
        </button>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- a local data URI, which next/image cannot optimize */}
      <img
        className="pointer-events-none max-w-none"
        alt="The image to place"
        src={moveImage.base64}
      />
    </motion.div>
  );
};

export default MoveImage;
