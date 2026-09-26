import { useRef, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';
import { RgbaColorPicker } from 'react-colorful';
import { BsPaletteFill } from 'react-icons/bs';
import { useClickAway } from 'react-use';

import { useOptions } from '@/common/state/options';

import { TOOLBAR_BUTTON } from './toolbarButton';
import { EntryAnimation } from '../animations/Entry.animations';

const ColorPicker = () => {
  const [options, setOptions] = useOptions();
  const ref = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        type="button"
        aria-label="Choose colors"
        aria-expanded={opened}
        className={TOOLBAR_BUTTON}
        onClick={() => setOpened((prev) => !prev)}
        disabled={options.mode === 'select'}
      >
        <BsPaletteFill className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute left-10 mt-24 rounded-lg bg-white p-4 shadow-lg sm:left-14 dark:bg-gray-800"
            variants={EntryAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <h2 className="mb-2 font-semibold text-purple-700 dark:text-purple-300">Line color</h2>
            <RgbaColorPicker
              color={options.lineColor}
              onChange={(lineColor) => setOptions((prev) => ({ ...prev, lineColor }))}
              className="mb-5"
            />
            <h2 className="mb-2 font-semibold text-purple-700 dark:text-purple-300">Fill color</h2>
            <RgbaColorPicker
              color={options.fillColor}
              onChange={(fillColor) => setOptions((prev) => ({ ...prev, fillColor }))}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPicker;
