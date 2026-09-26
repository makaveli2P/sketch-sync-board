import { AiOutlineClose } from 'react-icons/ai';

import { useModal } from '@/modules/modal';

const NotFoundModal = ({ id }: { id: string }) => {
  const { closeModal } = useModal();

  return (
    <div className="relative flex flex-col items-center rounded-md bg-white p-10">
      <button
        type="button"
        aria-label="Close"
        onClick={closeModal}
        className="absolute top-5 right-5"
      >
        <AiOutlineClose />
      </button>
      <h2 className="text-lg font-bold">
        {id ? `The room "${id}" does not exist or is full.` : 'The room does not exist or is full.'}
      </h2>
      <p>Check the room id, or try again later.</p>
    </div>
  );
};

export default NotFoundModal;
