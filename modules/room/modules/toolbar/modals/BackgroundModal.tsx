import { AiOutlineClose } from 'react-icons/ai';

import { useSetBackground, type Background } from '@/common/state/background';
import { useModal } from '@/modules/modal';

import { drawBackground } from '../../board/components/Background';

const OPTIONS: (Background & { label: string })[] = [
  { mode: 'dark', lines: true, label: 'Dark with dots' },
  { mode: 'light', lines: true, label: 'Light with dots' },
  { mode: 'dark', lines: false, label: 'Dark' },
  { mode: 'light', lines: false, label: 'Light' },
];

const BackgroundModal = () => {
  const { closeModal } = useModal();
  const setBackground = useSetBackground();

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
      <h2 className="mb-4 text-2xl font-bold">Choose background</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {OPTIONS.map(({ mode, lines, label }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            className="rounded-md border-2"
            onClick={() => {
              setBackground(mode, lines);
              closeModal();
            }}
          >
            <canvas
              className="block h-48 w-64 rounded-md"
              width={256}
              height={192}
              ref={(node) => {
                const ctx = node?.getContext('2d');
                if (ctx) drawBackground(ctx, mode, lines, 10);
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default BackgroundModal;
