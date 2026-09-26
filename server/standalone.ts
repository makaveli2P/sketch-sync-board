// The Socket.IO server without Next.js. Render runs this file, and Vercel
// hosts the Next.js frontend.
import { createServer } from 'node:http';

import { parseOrigins } from './origins';
import { attachSocket } from './socket';

const port = parseInt(process.env.PORT || '4000', 10);
const corsOrigins = parseOrigins(process.env.CLIENT_ORIGIN);

if (!corsOrigins.length) {
  console.error(
    'CLIENT_ORIGIN is not set. Set it to the frontend URL, for example https://sketch-sync-board.vercel.app',
  );
  process.exit(1);
}

const server = createServer((req, res) => {
  if (req.url === '/hello') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World');
    return;
  }
  res.writeHead(404);
  res.end();
});

attachSocket(server, { corsOrigins });

server.listen(port, () => {
  console.log(`> Socket server ready on port ${port}, allowed origins: ${corsOrigins.join(', ')}`);
});
