import { useEffect, useRef, useState } from 'react';

import { motion, useMotionValueEvent } from 'motion/react';
import { BsCursorFill } from 'react-icons/bs';

import { socket } from '@/common/lib/socket';
import { useRoom } from '@/common/state/room';

import { useBoardPosition } from '../hooks/useBoardPosition';

const MESSAGE_DURATION_MS = 3000;

const UserMouse = ({ userId }: { userId: string }) => {
  const { users } = useRoom();
  const boardPos = useBoardPosition();

  const [msg, setMsg] = useState('');
  const [x, setX] = useState(() => boardPos.x.get());
  const [y, setY] = useState(() => boardPos.y.get());
  const [pos, setPos] = useState({ x: -1, y: -1 });
  const msgTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useMotionValueEvent(boardPos.x, 'change', setX);
  useMotionValueEvent(boardPos.y, 'change', setY);

  useEffect(() => {
    const handleMouseMoved = (newX: number, newY: number, movedUserId: string) => {
      if (movedUserId === userId) setPos({ x: newX, y: newY });
    };

    const handleNewMsg = (msgUserId: string, newMsg: string) => {
      if (msgUserId !== userId) return;

      setMsg(newMsg);
      // A new message restarts the timer, so it stays for the full time.
      clearTimeout(msgTimer.current);
      msgTimer.current = setTimeout(() => setMsg(''), MESSAGE_DURATION_MS);
    };

    socket.on('mouse_moved', handleMouseMoved);
    socket.on('new_msg', handleNewMsg);

    return () => {
      socket.off('mouse_moved', handleMouseMoved);
      socket.off('new_msg', handleNewMsg);
      clearTimeout(msgTimer.current);
    };
  }, [userId]);

  const user = users.get(userId);

  return (
    <motion.div
      className={`pointer-events-none absolute top-0 left-0 z-20 ${pos.x === -1 ? 'hidden' : ''}`}
      style={{ color: user?.color }}
      animate={{ x: pos.x + x, y: pos.y + y }}
      transition={{ duration: 0.2, ease: 'linear' }}
    >
      <BsCursorFill className="-rotate-90" />
      {msg && (
        <p className="absolute top-full left-5 max-h-20 w-max max-w-60 overflow-hidden rounded-md bg-zinc-900 p-1 px-3 text-ellipsis text-white">
          {msg}
        </p>
      )}
      <p className="ml-2">{user?.name || 'Anonymous'}</p>
    </motion.div>
  );
};

export default UserMouse;
