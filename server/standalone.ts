// Socket.IO server without Next.js, for hosts where the frontend is deployed
// separately (e.g. Next.js on Vercel, this server on Render).
import { createServer } from 'http';

import express from 'express';

import { attachSocket } from './socket';

const port = parseInt(process.env.PORT || '4000', 10);
// Comma-separated list of frontend origins allowed to connect.
const corsOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();
const server = createServer(app);

attachSocket(server, corsOrigins);

app.get('/hello', async (_, res) => {
  res.send('Hello World');
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `> Socket server ready on port ${port}, allowed origins: ${
      corsOrigins.join(', ') || '(none)'
    }`
  );
});
