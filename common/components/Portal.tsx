import type { ReactNode } from 'react';

import { createPortal } from 'react-dom';

import { useIsClient } from '@/common/hooks/useIsClient';

const Portal = ({ children }: { children: ReactNode }) => {
  const isClient = useIsClient();
  const node = isClient ? document.getElementById('portal') : null;

  return node ? createPortal(children, node) : null;
};

export default Portal;
