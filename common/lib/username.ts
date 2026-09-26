import { MAX_USERNAME_LENGTH } from '@/common/constants/limits';

const KEY = 'sketchsync:username';

// Browser storage can be blocked (for example in a private window), so every
// access is in a try/catch.
export const loadUsername = () => {
  try {
    return (window.localStorage.getItem(KEY) ?? '').slice(0, MAX_USERNAME_LENGTH);
  } catch {
    return '';
  }
};

export const saveUsername = (username: string) => {
  try {
    window.localStorage.setItem(KEY, username);
  } catch {
    // Remembering the name is optional.
  }
};
