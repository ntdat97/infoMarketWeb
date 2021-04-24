import { nanoid } from 'nanoid';
import { NextMiddleware } from '../nextMiddleware';

export const addRequestId: NextMiddleware<any> = async (_req, res, next) => {
  res.setHeader('X-Request-ID', nanoid());
  await next();
};
