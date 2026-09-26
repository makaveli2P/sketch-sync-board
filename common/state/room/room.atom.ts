import { atom } from 'jotai';

import type { ClientRoom } from '@/common/types/global';

export const createRoom = (id = '', username = ''): ClientRoom => ({
  id,
  username,
  users: new Map(),
  usersMoves: new Map(),
  movesWithoutUser: [],
  myMoves: [],
});

export const roomAtom = atom<ClientRoom>(createRoom());
