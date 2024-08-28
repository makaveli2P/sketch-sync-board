import { useEffect } from 'react';
import { AiOutlineSelect } from 'react-icons/ai';
import { BsPencilFill } from 'react-icons/bs';
import { FaEraser } from 'react-icons/fa';
import { useOptions, useSetSelection } from '@/common/recoil/options';

const ModePicker = () => {
  const [options, setOptions] = useOptions();
  const { clearSelection } = useSetSelection();

  useEffect(() => {
    clearSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.mode]);

  const buttonClass = (mode: string) =>
    `btn-icon bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition duration-200 ${
      options.mode === mode ? 'ring-2 ring-purple-300' : ''
    }`;

  return (
    <>
      <button
        className={buttonClass('draw')}
        onClick={() => {
          setOptions((prev) => ({
            ...prev,
            mode: 'draw',
          }));
        }}
      >
        <BsPencilFill className="w-5 h-5" />
      </button>

      <button
        className={buttonClass('eraser')}
        onClick={() => {
          setOptions((prev) => ({
            ...prev,
            mode: 'eraser',
          }));
        }}
      >
        <FaEraser className="w-5 h-5" />
      </button>

      <button
        className={buttonClass('select')}
        onClick={() => {
          setOptions((prev) => ({
            ...prev,
            mode: 'select',
          }));
        }}
      >
        <AiOutlineSelect className="w-6 h-6" />
      </button>
    </>
  );
};

export default ModePicker;