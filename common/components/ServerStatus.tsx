import { useEffect, useState } from 'react';

import { useSocketConnected } from '@/common/hooks/useSocketConnected';

const SLOW_AFTER_MS = 3000;

// The free server sleeps when nobody uses it, and it needs up to a minute to
// start again. This tells the user why the buttons do not work yet.
const ServerStatus = () => {
  const connected = useSocketConnected();
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (connected) return undefined;

    const timer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => {
      clearTimeout(timer);
      setSlow(false);
    };
  }, [connected]);

  if (connected) return null;

  return (
    <p role="status" className="mt-6 max-w-80 text-center text-sm text-purple-900">
      {slow ? 'The server is starting. This can take up to a minute.' : 'Connecting to the server…'}
    </p>
  );
};

export default ServerStatus;
