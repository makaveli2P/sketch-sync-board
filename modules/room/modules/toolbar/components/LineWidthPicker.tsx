import { useRef, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';
import { BsBorderWidth } from 'react-icons/bs';
import { useClickAway } from 'react-use';

import { useOptions } from '@/common/state/options';

import { TOOLBAR_BUTTON } from './toolbarButton';
import { EntryAnimation } from '../animations/Entry.animations';

const LineWidthPicker = () => {
  const [options, setOptions] = useOptions();
  const ref = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        type="button"
        aria-label="Choose the line width"
        aria-expanded={opened}
        className={TOOLBAR_BUTTON}
        onClick={() => setOpened((prev) => !prev)}
        disabled={options.mode === 'select'}
      >
        <BsBorderWidth className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute top-[6px] left-14 w-36 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800"
            variants={EntryAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <input
              type="range"
              aria-label="Line width"
              min={1}
              max={20}
              value={options.lineWidth}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, lineWidth: parseInt(e.target.value, 10) }))
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-200 dark:bg-purple-700"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LineWidthPicker;
