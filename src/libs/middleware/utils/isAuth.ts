import Boom from '@hapi/boom';
import { NextMiddleware } from '../nextMiddleware';

export const isAuth: NextMiddleware<any> = async (req, res, next) => {
  if (!req.role || !req.uid) {
    return res.status(401).send(Boom.unauthorized());
  }
  await next();
};
