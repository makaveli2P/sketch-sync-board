import { CgScreen } from 'react-icons/cg';

import { useModal } from '@/modules/modal';

import { TOOLBAR_BUTTON } from './toolbarButton';
import BackgroundModal from '../modals/BackgroundModal';

const BackgroundPicker = () => {
  const { openModal } = useModal();

  return (
    <button
      type="button"
      aria-label="Choose the background"
      className={TOOLBAR_BUTTON}
      onClick={() => openModal(<BackgroundModal />)}
    >
      <CgScreen className="h-5 w-5" />
    </button>
  );
};

export default BackgroundPicker;
