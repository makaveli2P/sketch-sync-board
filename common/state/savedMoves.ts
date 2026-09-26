import { useCallback } from 'react';

import { atom, useAtomValue, useStore } from 'jotai';

import type { Move } from '@/common/types/global';

// Moves that the user undid. Redo draws them again.
export const savedMovesAtom = atom<Move[]>([]);

export const useSavedMoves = () => useAtomValue(savedMovesAtom);

export const useSetSavedMoves = () => {
  const store = useStore();

  const addSavedMove = useCallback(
    (move: Move) => store.set(savedMovesAtom, (prev) => [move, ...prev]),
    [store],
  );

  // Removes the last undone move and returns it.
  const removeSavedMove = useCallback(() => {
    const [move, ...rest] = store.get(savedMovesAtom);
    store.set(savedMovesAtom, rest);
    return move;
  }, [store]);

  const clearSavedMoves = useCallback(() => store.set(savedMovesAtom, []), [store]);

  return { addSavedMove, removeSavedMove, clearSavedMoves };
};
