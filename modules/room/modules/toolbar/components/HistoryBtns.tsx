import { FaRedo, FaUndo } from 'react-icons/fa';

import { useSocketConnected } from '@/common/hooks/useSocketConnected';
import { useOptionsValue } from '@/common/state/options';
import { useRoom } from '@/common/state/room';
import { useSavedMoves } from '@/common/state/savedMoves';

import { TOOLBAR_BUTTON } from './toolbarButton';
import { useRefs } from '../../../hooks/useRefs';

const HistoryBtns = () => {
  const { actionsRef } = useRefs();
  const { myMoves } = useRoom();
  const savedMoves = useSavedMoves();
  const connected = useSocketConnected();
  const { selection } = useOptionsValue();

  return (
    <>
      <button
        type="button"
        aria-label="Redo"
        className={TOOLBAR_BUTTON}
        disabled={!connected || !savedMoves.length}
        onClick={() => actionsRef.current.redo()}
      >
        <FaRedo className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Undo"
        className={TOOLBAR_BUTTON}
        disabled={!selection && (!connected || !myMoves.length)}
        onClick={() => actionsRef.current.undo()}
      >
        <FaUndo className="h-5 w-5" />
      </button>
    </>
  );
};

export default HistoryBtns;
