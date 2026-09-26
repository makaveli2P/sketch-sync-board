import { useEffect } from 'react';

import { useAtomValue } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';

import Portal from '@/common/components/Portal';

import { bgAnimation, modalAnimation } from '../animations/ModalManager.animations';
import { modalAtom, useModal } from '../state/modal';

const ModalManager = () => {
  const { opened, modal } = useAtomValue(modalAtom);
  const { closeModal } = useModal();

  // The portal covers the page. It must not catch clicks while it is empty.
  useEffect(() => {
    const node = document.getElementById('portal');
    if (node) node.style.pointerEvents = opened ? 'all' : 'none';
  }, [opened]);

  useEffect(() => {
    if (!opened) return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeModal, opened]);

  return (
    <Portal>
      <motion.div
        className="absolute z-40 flex min-h-full w-full items-center justify-center bg-black/80"
        onClick={closeModal}
        variants={bgAnimation}
        initial="closed"
        animate={opened ? 'opened' : 'closed'}
      >
        <AnimatePresence>
          {opened && (
            <motion.div
              role="dialog"
              aria-modal="true"
              variants={modalAnimation}
              initial="closed"
              animate="opened"
              exit="exited"
              onClick={(e) => e.stopPropagation()}
              className="p-6"
            >
              {modal}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Portal>
  );
};

export default ModalManager;
