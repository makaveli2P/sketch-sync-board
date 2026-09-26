import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

// False on the server and during hydration, true after that.
export const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
