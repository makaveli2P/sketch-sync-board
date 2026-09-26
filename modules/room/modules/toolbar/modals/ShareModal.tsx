import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { useIsClient } from '@/common/hooks/useIsClient';
import { useRoom } from '@/common/state/room';
import { useModal } from '@/modules/modal';

import { TOAST_OPTIONS } from '../../../context/Room.context';

const ShareModal = () => {
  const { id } = useRoom();
  const { closeModal } = useModal();
  const isClient = useIsClient();

  const url = isClient ? `${window.location.origin}/${id}` : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast('The link is copied.', TOAST_OPTIONS);
    } catch {
      toast.error('The browser did not allow access to the clipboard.', TOAST_OPTIONS);
    }
  };

  return (
    <div className="relative flex flex-col items-center rounded-md bg-white p-10 pt-5">
      <button
        type="button"
        aria-label="Close"
        onClick={closeModal}
        className="absolute top-5 right-5"
      >
        <AiOutlineClose />
      </button>
      <h2 className="text-2xl font-bold">Invite</h2>
      <p>
        Room id: <span className="font-bold">{id}</span>
      </p>
      <div className="relative mt-2">
        <input type="text" aria-label="Room link" value={url} readOnly className="input sm:w-96" />
        <button type="button" className="absolute right-0 h-full btn" onClick={handleCopy}>
          Copy
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
