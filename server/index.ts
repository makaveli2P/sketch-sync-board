// Next.js and the Socket.IO server on one port, for local development and
// for hosts that can run one long-lived Node.js process.
import { createServer } from 'node:http';

import next from 'next';

import { attachSocket } from './socket';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });

nextApp.prepare().then(() => {
  const handleRequest = nextApp.getRequestHandler();
  const handleUpgrade = nextApp.getUpgradeHandler();

  const server = createServer((req, res) => {
    if (req.url === '/hello') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hello World');
      return;
    }
    handleRequest(req, res);
  });

  // Socket.IO handles its own upgrade requests. Next.js handles the others
  // (hot reload in development).
  attachSocket(server, { destroyUpgrade: false });
  server.on('upgrade', (req, socket, head) => {
    if (!req.url?.startsWith('/socket.io/')) handleUpgrade(req, socket, head);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
