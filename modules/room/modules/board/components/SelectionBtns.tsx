import { useState } from 'react';

import { useMotionValueEvent } from 'motion/react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsArrowsMove } from 'react-icons/bs';
import { FiCopy } from 'react-icons/fi';

import { useOptionsValue } from '@/common/state/options';

import { useRefs } from '../../../hooks/useRefs';
import { useBoardPosition } from '../hooks/useBoardPosition';

const SelectionBtns = () => {
  const { selection } = useOptionsValue();
  const { actionsRef } = useRefs();
  const boardPos = useBoardPosition();

  const [boardX, setX] = useState(() => boardPos.x.get());
  const [boardY, setY] = useState(() => boardPos.y.get());
  useMotionValueEvent(boardPos.x, 'change', setX);
  useMotionValueEvent(boardPos.y, 'change', setY);

  if (!selection) return null;

  const { x, y, height, width } = selection;
  const top = Math.min(y, y + height) - 40 + boardY;
  const left = Math.min(x, x + width) + boardX;

  const buttonClass = 'rounded-full bg-gray-200 p-2';

  return (
    <div
      className="absolute top-0 left-0 z-50 flex items-center justify-center gap-2"
      style={{ top, left }}
    >
      <button
        type="button"
        aria-label="Move the selection"
        className={buttonClass}
        onClick={() => actionsRef.current.moveSelection()}
      >
        <BsArrowsMove />
      </button>
      <button
        type="button"
        aria-label="Copy the selection"
        className={buttonClass}
        onClick={() => actionsRef.current.copySelection()}
      >
        <FiCopy />
      </button>
      <button
        type="button"
        aria-label="Delete the selection"
        className={buttonClass}
        onClick={() => actionsRef.current.deleteSelection()}
      >
        <AiOutlineDelete />
      </button>
    </div>
  );
};

export default SelectionBtns;
