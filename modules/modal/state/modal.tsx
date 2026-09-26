import { useCallback, type ReactNode } from 'react';

import { atom, useSetAtom } from 'jotai';

export const modalAtom = atom<{ modal: ReactNode; opened: boolean }>({
  modal: null,
  opened: false,
});

export const useModal = () => {
  const setModal = useSetAtom(modalAtom);

  const openModal = useCallback(
    (modal: ReactNode) => setModal({ modal, opened: true }),
    [setModal],
  );

  const closeModal = useCallback(
    () => setModal((prev) => ({ ...prev, opened: false })),
    [setModal],
  );

  return { openModal, closeModal };
};
