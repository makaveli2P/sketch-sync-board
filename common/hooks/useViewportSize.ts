import { useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
  window.addEventListener('resize', onChange);
  return () => window.removeEventListener('resize', onChange);
};

export const useViewportSize = () => {
  const width = useSyncExternalStore(
    subscribe,
    () => window.innerWidth,
    () => 0,
  );
  const height = useSyncExternalStore(
    subscribe,
    () => window.innerHeight,
    () => 0,
  );

  return { width, height };
};
