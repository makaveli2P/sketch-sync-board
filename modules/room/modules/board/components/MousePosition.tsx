import { useRef, useState, type RefObject } from 'react';

import { motion } from 'motion/react';
import { useInterval, useMouse } from 'react-use';

import { getPos } from '@/common/lib/getPos';
import { socket } from '@/common/lib/socket';

import { useBoardPosition } from '../hooks/useBoardPosition';

const MousePosition = () => {
  const { x, y } = useBoardPosition();

  const prevPosition = useRef({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const { docX, docY } = useMouse(ref as RefObject<Element>);

  // This component renders only in the browser, after the user joins a room.
  const [touchDevice] = useState(() => window.matchMedia('(pointer: coarse)').matches);

  useInterval(
    () => {
      if (prevPosition.current.x === docX && prevPosition.current.y === docY) return;

      socket.emit('mouse_move', getPos(docX, x), getPos(docY, y));
      prevPosition.current = { x: docX, y: docY };
    },
    touchDevice ? null : 150,
  );

  if (touchDevice) return null;

  return (
    <motion.div
      ref={ref}
      className="pointer-events-none absolute top-0 left-0 z-50 transition-colors select-none dark:text-white"
      animate={{ x: docX + 15, y: docY + 15 }}
      transition={{ duration: 0.05, ease: 'linear' }}
    >
      {getPos(docX, x).toFixed(0)} | {getPos(docY, y).toFixed(0)}
    </motion.div>
  );
};

export default MousePosition;
