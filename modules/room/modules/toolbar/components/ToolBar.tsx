import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { FiChevronRight } from 'react-icons/fi';
import { HiOutlineDownload } from 'react-icons/hi';
import { ImExit } from 'react-icons/im';
import { IoIosShareAlt } from 'react-icons/io';
import { CANVAS_SIZE } from '@/common/constants/canvasSize';
import { useViewportSize } from '@/common/hooks/useViewportSize';
import { useModal } from '@/modules/modal';
import { useRefs } from '../../../hooks/useRefs';
import ShareModal from '../modals/ShareModal';
import BackgroundPicker from './BackgoundPicker';
import ColorPicker from './ColorPicker';
import HistoryBtns from './HistoryBtns';
import ImagePicker from './ImagePicker';
import LineWidthPicker from './LineWidthPicker';
import ModePicker from './ModePicker';
import ShapeSelector from './ShapeSelector';

const ToolBar = () => {
  const { canvasRef, bgRef } = useRefs();
  const { openModal } = useModal();
  const { width } = useViewportSize();
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (width >= 1024) setOpened(true);
    else setOpened(false);
  }, [width]);

  const handleExit = () => router.push('/');

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE.width;
    canvas.height = CANVAS_SIZE.height;

    const tempCtx = canvas.getContext('2d');

    if (tempCtx && canvasRef.current && bgRef.current) {
      tempCtx.drawImage(bgRef.current, 0, 0);
      tempCtx.drawImage(canvasRef.current, 0, 0);
    }

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'canvas.png';
    link.click();
  };

  const handleShare = () => openModal(<ShareModal />);

  const buttonClass = "btn-icon bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition duration-200";

  return (
    <>
      <motion.button
        className="btn-icon absolute bottom-1/2 -left-2 z-50 h-10 w-10 rounded-full bg-purple-600 text-white text-2xl transition-none lg:hidden"
        animate={{ rotate: opened ? 0 : 180 }}
        transition={{ duration: 0.2 }}
        onClick={() => setOpened(!opened)}
      >
        <FiChevronRight />
      </motion.button>
      <motion.div
        className="absolute left-10 top-[50%] z-50 grid grid-cols-2 items-center gap-5 rounded-lg bg-white dark:bg-gray-800 p-5 text-purple-700 dark:text-purple-300 shadow-lg 2xl:grid-cols-1"
        animate={{
          x: opened ? 0 : -160,
          y: '-50%',
        }}
        transition={{
          duration: 0.2,
        }}
      >
        <HistoryBtns />

        <div className="h-px w-full bg-purple-200 dark:bg-purple-700 2xl:hidden" />
        <div className="h-px w-full bg-purple-200 dark:bg-purple-700" />

        <ShapeSelector />
        <ColorPicker />
        <LineWidthPicker />
        <ModePicker />
        <ImagePicker />

        <div className="2xl:hidden"></div>
        <div className="h-px w-full bg-purple-200 dark:bg-purple-700 2xl:hidden" />
        <div className="h-px w-full bg-purple-200 dark:bg-purple-700" />

        <BackgroundPicker />
        <button className={buttonClass} onClick={handleShare}>
          <IoIosShareAlt className="w-5 h-5" />
        </button>
        <button className={buttonClass} onClick={handleDownload}>
          <HiOutlineDownload className="w-5 h-5" />
        </button>
        <button className={buttonClass} onClick={handleExit}>
          <ImExit className="w-5 h-5" />
        </button>
      </motion.div>
    </>
  );
};

export default ToolBar;