import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import express, { Application, NextFunction, Request, Response } from 'express';

import { auths, users } from './routes';
import { CustomError } from './utils';
import { configs } from './config';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/ping', (_: Request, res: Response) => {
  res.json({ message: 'Server is up and running' });
});

app.use('/api/v1/auths', auths);
app.use('/api/v1/users', users);

app.all('/{*methods}', (req: Request, res: Response, next: NextFunction) => {
  next(
    new CustomError(
      `Not Found: can not make a ${req.method} to ${req.originalUrl}`,
      404,
    ),
  );
});

app.use((err: any, req: Request, res: Response, _: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const server = http.createServer(app);
server.listen(configs().PORT, async () => {
  console.log(`API running on port: ${configs().PORT}`);
});
