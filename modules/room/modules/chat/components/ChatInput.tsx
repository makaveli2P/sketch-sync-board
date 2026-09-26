import { useState, type FormEvent } from 'react';

import { AiOutlineSend } from 'react-icons/ai';

import { MAX_MESSAGE_LENGTH } from '@/common/constants/limits';
import { socket } from '@/common/lib/socket';

const ChatInput = () => {
  const [msg, setMsg] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!msg.trim()) return;

    socket.emit('send_msg', msg);
    setMsg('');
  };

  return (
    <form className="flex w-full items-center gap-2" onSubmit={handleSubmit}>
      <input
        aria-label="Message"
        className="w-full rounded-lg border border-purple-300 p-2 focus:ring-2 focus:ring-purple-500 focus:outline-hidden dark:border-purple-600 dark:bg-gray-700 dark:text-white"
        value={msg}
        maxLength={MAX_MESSAGE_LENGTH}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        aria-label="Send"
        className="btn-icon h-10 w-10 rounded-full bg-purple-600 text-white transition-colors duration-200 hover:bg-purple-700"
        type="submit"
      >
        <AiOutlineSend />
      </button>
    </form>
  );
};

export default ChatInput;
