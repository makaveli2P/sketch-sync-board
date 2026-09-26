import { useRef, useState, type ReactNode } from 'react';

import { AnimatePresence, motion } from 'motion/react';
import { BiRectangle } from 'react-icons/bi';
import { BsCircle } from 'react-icons/bs';
import { CgShapeZigzag } from 'react-icons/cg';
import { useClickAway } from 'react-use';

import { useOptions } from '@/common/state/options';
import type { Shape } from '@/common/types/global';

import { TOOLBAR_BUTTON } from './toolbarButton';
import { EntryAnimation } from '../animations/Entry.animations';

const SHAPES: { shape: Exclude<Shape, 'image'>; label: string; icon: ReactNode }[] = [
  { shape: 'line', label: 'Line', icon: <CgShapeZigzag className="h-5 w-5" /> },
  { shape: 'rect', label: 'Rectangle', icon: <BiRectangle className="h-5 w-5" /> },
  { shape: 'circle', label: 'Circle', icon: <BsCircle className="h-5 w-5" /> },
];

const ShapeSelector = () => {
  const [options, setOptions] = useOptions();
  const ref = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  const current = SHAPES.find(({ shape }) => shape === options.shape) ?? SHAPES[0];

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        type="button"
        aria-label={`Shape: ${current.label}`}
        aria-expanded={opened}
        className={TOOLBAR_BUTTON}
        disabled={options.mode === 'select'}
        onClick={() => setOpened((prev) => !prev)}
      >
        {current.icon}
      </button>

      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute left-14 z-10 flex gap-2 rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800"
            variants={EntryAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            {SHAPES.map(({ shape, label, icon }) => (
              <button
                key={shape}
                type="button"
                aria-label={label}
                className={TOOLBAR_BUTTON}
                onClick={() => {
                  setOptions((prev) => ({ ...prev, shape }));
                  setOpened(false);
                }}
              >
                {icon}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShapeSelector;
