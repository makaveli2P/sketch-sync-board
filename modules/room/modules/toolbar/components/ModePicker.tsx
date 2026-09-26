import type { ReactNode } from 'react';

import { AiOutlineSelect } from 'react-icons/ai';
import { BsPencilFill } from 'react-icons/bs';
import { FaEraser } from 'react-icons/fa';

import { useOptions } from '@/common/state/options';
import type { CtxMode } from '@/common/types/global';

import { TOOLBAR_BUTTON } from './toolbarButton';

const MODES: { mode: CtxMode; label: string; icon: ReactNode }[] = [
  { mode: 'draw', label: 'Draw', icon: <BsPencilFill className="h-5 w-5" /> },
  { mode: 'eraser', label: 'Eraser', icon: <FaEraser className="h-5 w-5" /> },
  { mode: 'select', label: 'Select', icon: <AiOutlineSelect className="h-6 w-6" /> },
];

const ModePicker = () => {
  const [options, setOptions] = useOptions();

  return (
    <>
      {MODES.map(({ mode, label, icon }) => (
        <button
          key={mode}
          type="button"
          aria-label={label}
          aria-pressed={options.mode === mode}
          className={`${TOOLBAR_BUTTON} ${options.mode === mode ? 'ring-2 ring-purple-300' : ''}`}
          // A new mode also removes the selection.
          onClick={() => setOptions((prev) => ({ ...prev, mode, selection: null }))}
        >
          {icon}
        </button>
      ))}
    </>
  );
};

export default ModePicker;
