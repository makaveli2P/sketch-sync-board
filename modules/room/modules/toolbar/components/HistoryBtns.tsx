import { FaRedo, FaUndo } from 'react-icons/fa';
import { useMyMoves } from '@/common/recoil/room';
import { useSavedMoves } from '@/common/recoil/savedMoves';
import { useRefs } from '../../../hooks/useRefs';

const HistoryBtns = () => {
  const { redoRef, undoRef } = useRefs();
  const { myMoves } = useMyMoves();
  const savedMoves = useSavedMoves();

  return (
    <>
      <button
        className="btn-icon bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        ref={redoRef}
        disabled={!savedMoves.length}
      >
        <FaRedo className="w-5 h-5" />
      </button>
      <button
        className="btn-icon bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        ref={undoRef}
        disabled={!myMoves.length}
      >
        <FaUndo className="w-5 h-5" />
      </button>
    </>
  );
};

export default HistoryBtns;