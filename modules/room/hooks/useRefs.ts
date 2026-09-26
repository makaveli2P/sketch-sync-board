import { useContext } from 'react';

import { roomContext } from '../context/Room.context';

export const useRefs = () => {
  const { bgRef, canvasRef, minimapRef, actionsRef } = useContext(roomContext);

  return { bgRef, canvasRef, minimapRef, actionsRef };
};
