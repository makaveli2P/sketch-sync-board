import { useContext } from 'react';

import { roomContext } from '../../../context/Room.context';

export const useCtx = () => useContext(roomContext).ctx;
