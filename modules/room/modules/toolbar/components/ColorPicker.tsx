import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RgbaColorPicker } from 'react-colorful';
import { BsPaletteFill } from 'react-icons/bs';
import { useClickAway } from 'react-use';
import { useOptions } from '@/common/recoil/options/options.hooks';
import { EntryAnimation } from '../animations/Entry.animations';

const ColorPicker = () => {
  const [options, setOptions] = useOptions();
  const ref = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        className="btn-icon bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition duration-200"
        onClick={() => setOpened(!opened)}
        disabled={options.mode === 'select'}
      >
        <BsPaletteFill className="w-5 h-5" />
      </button>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute left-10 mt-24 sm:left-14 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
            variants={EntryAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <h2 className="mb-2 font-semibold text-purple-700 dark:text-purple-300">
              Line color
            </h2>
            <RgbaColorPicker
              color={options.lineColor}
              onChange={(e) => {
                setOptions({
                  ...options,
                  lineColor: e,
                });
              }}
              className="mb-5"
            />
            <h2 className="mb-2 font-semibold text-purple-700 dark:text-purple-300">
              Fill color
            </h2>
            <RgbaColorPicker
              color={options.fillColor}
              onChange={(e) => {
                setOptions({
                  ...options,
                  fillColor: e,
                });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPicker;