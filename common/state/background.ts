import { useCallback, useEffect } from 'react';

import { atom, useAtomValue, useSetAtom } from 'jotai';

export interface Background {
  mode: 'dark' | 'light';
  lines: boolean;
}

export const backgroundAtom = atom<Background>({ mode: 'light', lines: true });

export const useBackground = () => {
  const bg = useAtomValue(backgroundAtom);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', bg.mode === 'dark');
    root.classList.toggle('light', bg.mode !== 'dark');
  }, [bg.mode]);

  return bg;
};

export const useSetBackground = () => {
  const setBg = useSetAtom(backgroundAtom);

  return useCallback((mode: Background['mode'], lines: boolean) => setBg({ mode, lines }), [setBg]);
};
