import { FormEvent, useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { socket } from '@/common/lib/socket';

const ChatInput = () => {
  const [msg, setMsg] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (msg.trim()) {
      socket.emit('send_msg', msg);
      setMsg('');
    }
  };

  return (
    <form className="flex w-full items-center gap-2" onSubmit={handleSubmit}>
      <input
        className="w-full rounded-lg border border-purple-300 p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-purple-600 dark:text-white"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        className="btn-icon h-10 w-10 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200"
        type="submit"
      >
        <AiOutlineSend />
      </button>
    </form>
  );
};

export default ChatInput;