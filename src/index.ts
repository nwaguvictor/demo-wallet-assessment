import http from 'http';
import express, { Application, NextFunction, Request, Response } from 'express';

import { auths, users } from './routes';
import { configs } from './config';

const app: Application = express();

app.get('/ping', (_: Request, res: Response) => {
  res.json({ message: 'Server is up and running' });
});

app.use('/api/v1/auths', auths);
app.use('/api/v1/users', users);

// app.all('*', (req: Request, res: Response, next: NextFunction) => {
//   return next(
//     new Error(`Not Found: can not make a ${req.method} to ${req.originalUrl}`),
//   );
// });

const server = http.createServer(app);

server.listen(configs().PORT, async () => {
  console.log(`API running on port: ${configs().PORT}`);
});
