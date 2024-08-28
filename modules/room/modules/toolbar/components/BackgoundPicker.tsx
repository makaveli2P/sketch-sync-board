import { CgScreen } from 'react-icons/cg';
import { useModal } from '@/modules/modal';
import BackgroundModal from '../modals/BackgroundModal';

const BackgroundPicker = () => {
  const { openModal } = useModal();

  return (
    <button
      className="btn-icon bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition duration-200"
      onClick={() => openModal(<BackgroundModal />)}
    >
      <CgScreen className="w-5 h-5" />
    </button>
  );
};

export default BackgroundPicker;