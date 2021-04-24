import Boom from '@hapi/boom';
import { NextMiddleware } from '../nextMiddleware';

export const isAdmin: NextMiddleware<any> = async (req, res, next) => {
  if (!req.role.includes('ADMIN')) {
    return res.status(401).send(Boom.unauthorized());
  }
  await next();
};
