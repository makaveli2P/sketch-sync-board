import { useCallback } from 'react';

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import type { CtxOptions, Rect } from '@/common/types/global';

export const optionsAtom = atom<CtxOptions>({
  lineColor: { r: 0, g: 0, b: 0, a: 1 },
  fillColor: { r: 0, g: 0, b: 0, a: 0 },
  lineWidth: 5,
  mode: 'draw',
  shape: 'line',
  selection: null,
});

export const useOptionsValue = () => useAtomValue(optionsAtom);

export const useSetOptions = () => useSetAtom(optionsAtom);

export const useOptions = () => useAtom(optionsAtom);

export const useSetSelection = () => {
  const setOptions = useSetOptions();

  const setSelection = useCallback(
    (rect: Rect) => setOptions((prev) => ({ ...prev, selection: rect })),
    [setOptions],
  );

  const clearSelection = useCallback(
    () => setOptions((prev) => (prev.selection ? { ...prev, selection: null } : prev)),
    [setOptions],
  );

  return { setSelection, clearSelection };
};
