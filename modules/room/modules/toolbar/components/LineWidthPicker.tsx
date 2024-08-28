import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BsBorderWidth } from 'react-icons/bs';
import { useClickAway } from 'react-use';
import { useOptions } from '@/common/recoil/options';
import { EntryAnimation } from '../animations/Entry.animations';

const LineWidthPicker = () => {
  const [options, setOptions] = useOptions();
  const ref = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        className="btn-icon bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setOpened(!opened)}
        disabled={options.mode === 'select'}
      >
        <BsBorderWidth className="w-5 h-5" />
      </button>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute top-[6px] left-14 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
            variants={EntryAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <input
              type="range"
              min={1}
              max={20}
              value={options.lineWidth}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  lineWidth: parseInt(e.target.value, 10),
                }))
              }
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer dark:bg-purple-700"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LineWidthPicker;