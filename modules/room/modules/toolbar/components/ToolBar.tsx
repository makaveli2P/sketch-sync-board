import { useState } from 'react';

import { motion } from 'motion/react';
import { useRouter } from 'next/router';
import { FiChevronRight } from 'react-icons/fi';
import { HiOutlineDownload } from 'react-icons/hi';
import { ImExit } from 'react-icons/im';
import { IoIosShareAlt } from 'react-icons/io';

import { CANVAS_SIZE } from '@/common/constants/canvasSize';
import { useViewportSize } from '@/common/hooks/useViewportSize';
import { useRoom } from '@/common/state/room';
import { useModal } from '@/modules/modal';

import BackgroundPicker from './BackgroundPicker';
import ColorPicker from './ColorPicker';
import HistoryBtns from './HistoryBtns';
import ImagePicker from './ImagePicker';
import LineWidthPicker from './LineWidthPicker';
import ModePicker from './ModePicker';
import ShapeSelector from './ShapeSelector';
import { TOOLBAR_BUTTON } from './toolbarButton';
import { useRefs } from '../../../hooks/useRefs';
import ShareModal from '../modals/ShareModal';

// Large screens always show the toolbar. Small screens show a toggle button.
const LARGE_SCREEN = 1024;

const ToolBar = () => {
  const { canvasRef, bgRef } = useRefs();
  const { id } = useRoom();
  const { openModal } = useModal();
  const { width } = useViewportSize();
  const [openedOnSmallScreen, setOpenedOnSmallScreen] = useState(false);
  const router = useRouter();

  const opened = width >= LARGE_SCREEN || openedOnSmallScreen;

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE.width;
    canvas.height = CANVAS_SIZE.height;

    const tempCtx = canvas.getContext('2d');
    if (!tempCtx || !canvasRef.current || !bgRef.current) return;

    tempCtx.drawImage(bgRef.current, 0, 0);
    tempCtx.drawImage(canvasRef.current, 0, 0);

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `sketchsync-${id}.png`;
    link.click();
  };

  const divider = 'h-px w-full bg-purple-200 dark:bg-purple-700';

  return (
    <>
      <motion.button
        type="button"
        aria-label={opened ? 'Hide the toolbar' : 'Show the toolbar'}
        className="absolute bottom-1/2 -left-2 z-60 btn-icon h-10 w-10 rounded-full bg-purple-600 text-2xl text-white transition-none lg:hidden"
        animate={{ rotate: opened ? 0 : 180 }}
        transition={{ duration: 0.2 }}
        onClick={() => setOpenedOnSmallScreen((prev) => !prev)}
      >
        <FiChevronRight />
      </motion.button>
      <motion.div
        className="absolute top-[50%] left-10 z-60 grid grid-cols-2 items-center gap-5 rounded-lg bg-white p-5 text-purple-700 shadow-lg 2xl:grid-cols-1 dark:bg-gray-800 dark:text-purple-300"
        animate={{ x: opened ? 0 : -160, y: '-50%' }}
        transition={{ duration: 0.2 }}
      >
        <HistoryBtns />

        <div className={`${divider} 2xl:hidden`} />
        <div className={divider} />

        <ShapeSelector />
        <ColorPicker />
        <LineWidthPicker />
        <ModePicker />
        <ImagePicker />

        <div className="2xl:hidden" />
        <div className={`${divider} 2xl:hidden`} />
        <div className={divider} />

        <BackgroundPicker />
        <button
          type="button"
          aria-label="Invite people"
          className={TOOLBAR_BUTTON}
          onClick={() => openModal(<ShareModal />)}
        >
          <IoIosShareAlt className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Download the board"
          className={TOOLBAR_BUTTON}
          onClick={handleDownload}
        >
          <HiOutlineDownload className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Leave the room"
          className={TOOLBAR_BUTTON}
          onClick={() => router.push('/')}
        >
          <ImExit className="h-5 w-5" />
        </button>
      </motion.div>
    </>
  );
};

export default ToolBar;
