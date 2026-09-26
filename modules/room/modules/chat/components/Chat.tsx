import { useEffect, useRef, useState } from 'react';

import { useStore } from 'jotai';
import { motion } from 'motion/react';
import { BsFillChatFill } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa';

import { socket } from '@/common/lib/socket';
import { roomAtom } from '@/common/state/room';
import type { MessageType } from '@/common/types/global';

import ChatInput from './ChatInput';
import Message from './Message';

const Chat = () => {
  const store = useStore();
  const msgList = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const openedRef = useRef(false);
  const [newMsg, setNewMsg] = useState(false);
  const [opened, setOpened] = useState(false);
  const [msgs, setMsgs] = useState<MessageType[]>([]);

  useEffect(() => {
    const handleNewMsg = (userId: string, msg: string) => {
      const user = store.get(roomAtom).users.get(userId);
      const id = nextId.current;
      nextId.current += 1;

      setMsgs((prev) => [
        ...prev,
        {
          userId,
          msg,
          id,
          username: user?.name || 'Anonymous',
          color: user?.color || '#000',
        },
      ]);
      if (!openedRef.current) setNewMsg(true);
    };

    socket.on('new_msg', handleNewMsg);
    return () => {
      socket.off('new_msg', handleNewMsg);
    };
  }, [store]);

  // Scroll after the new message is on the page.
  useEffect(() => {
    msgList.current?.scroll({ top: msgList.current.scrollHeight });
  }, [msgs]);

  const toggle = () => {
    openedRef.current = !opened;
    setOpened(!opened);
    setNewMsg(false);
  };

  return (
    <motion.div
      className="absolute bottom-0 z-50 flex h-[300px] w-full flex-col overflow-hidden rounded-t-md shadow-lg sm:left-44 sm:w-120"
      animate={{ y: opened ? 0 : 260 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        aria-expanded={opened}
        className="flex w-full items-center justify-between bg-purple-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-purple-700"
        onClick={toggle}
      >
        <div className="flex items-center gap-2">
          <BsFillChatFill className="-mt-0.5" />
          Chat
          {newMsg && (
            <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
              New!
            </span>
          )}
        </div>
        <motion.div animate={{ rotate: opened ? 0 : 180 }} transition={{ duration: 0.2 }}>
          <FaChevronDown />
        </motion.div>
      </button>
      {/* Hidden content must not get keyboard focus. */}
      <div
        inert={!opened}
        className="flex flex-1 flex-col justify-between bg-white p-3 dark:bg-gray-800"
      >
        <div className="h-[190px] overflow-y-auto pr-2 text-black dark:text-white" ref={msgList}>
          {msgs.map((msg) => (
            <Message key={msg.id} {...msg} />
          ))}
        </div>
        <ChatInput />
      </div>
    </motion.div>
  );
};

export default Chat;
