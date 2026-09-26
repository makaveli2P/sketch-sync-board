import { createServer } from 'http';

import express from 'express';
import next, { NextApiHandler } from 'next';

import { attachSocket } from './socket';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();
  const server = createServer(app);

  attachSocket(server);

  app.get('/hello', async (_, res) => {
    res.send('Hello World');
  });

  app.all('*', (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`);
  });
});
