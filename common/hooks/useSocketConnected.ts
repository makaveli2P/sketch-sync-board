import { useSyncExternalStore } from 'react';

import { socket } from '@/common/lib/socket';

const subscribe = (onChange: () => void) => {
  socket.on('connect', onChange);
  socket.on('disconnect', onChange);
  return () => {
    socket.off('connect', onChange);
    socket.off('disconnect', onChange);
  };
};

export const useSocketConnected = () =>
  useSyncExternalStore(
    subscribe,
    () => socket.connected,
    () => false,
  );
