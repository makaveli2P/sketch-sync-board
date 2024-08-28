import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiRectangle } from 'react-icons/bi';
import { BsCircle } from 'react-icons/bs';
import { CgShapeZigzag } from 'react-icons/cg';
import { useClickAway } from 'react-use';
import { useOptions } from '@/common/recoil/options';
import { Shape } from '@/common/types/global';
import { EntryAnimation } from '../animations/Entry.animations';

const ShapeSelector = () => {
  const [options, setOptions] = useOptions();
  const ref = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  const handleShapeChange = (shape: Shape) => {
    setOptions((prev) => ({
      ...prev,
      shape,
    }));
    setOpened(false);
  };

  const buttonClass = "btn-icon bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition duration-200";

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        className={`${buttonClass} ${options.mode === 'select' ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={options.mode === 'select'}
        onClick={() => setOpened((prev) => !prev)}
      >
        {options.shape === 'circle' && <BsCircle className="w-5 h-5" />}
        {options.shape === 'rect' && <BiRectangle className="w-5 h-5" />}
        {options.shape === 'line' && <CgShapeZigzag className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute left-14 z-10 flex gap-2 rounded-lg bg-white dark:bg-gray-800 p-2 shadow-lg"
            variants={EntryAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <button className={buttonClass} onClick={() => handleShapeChange('line')}>
              <CgShapeZigzag className="w-5 h-5" />
            </button>
            <button className={buttonClass} onClick={() => handleShapeChange('rect')}>
              <BiRectangle className="w-5 h-5" />
            </button>
            <button className={buttonClass} onClick={() => handleShapeChange('circle')}>
              <BsCircle className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShapeSelector;