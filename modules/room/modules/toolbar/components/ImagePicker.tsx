import { useCallback, useEffect, useRef } from 'react';

import { BsFillImageFill } from 'react-icons/bs';
import { toast } from 'react-toastify';

import { optimizeImage } from '@/common/lib/optimizeImage';

import { TOOLBAR_BUTTON } from './toolbarButton';
import { TOAST_OPTIONS } from '../../../context/Room.context';
import { useMoveImage } from '../../../hooks/useMoveImage';

const ImagePicker = () => {
  const { setMoveImage } = useMoveImage();
  const inputRef = useRef<HTMLInputElement>(null);

  const addImage = useCallback(
    async (file: File) => {
      try {
        setMoveImage({ base64: await optimizeImage(file) });
      } catch (err) {
        const message = err instanceof Error ? err.message : '';
        toast.error(`Could not add the image. ${message}`, TOAST_OPTIONS);
      }
    },
    [setMoveImage],
  );

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const file = [...(e.clipboardData?.items ?? [])]
        .find((item) => item.type.startsWith('image/'))
        ?.getAsFile();
      if (file) addImage(file);
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [addImage]);

  return (
    <>
      <button
        type="button"
        aria-label="Add an image"
        className={TOOLBAR_BUTTON}
        onClick={() => inputRef.current?.click()}
      >
        <BsFillImageFill className="h-5 w-5" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) addImage(file);
          // Allow the same file again.
          e.target.value = '';
        }}
      />
    </>
  );
};

export default ImagePicker;
