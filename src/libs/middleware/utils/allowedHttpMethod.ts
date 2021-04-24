import { NextMiddleware } from '../nextMiddleware';

export const allowedHttpMethod = (
  httpMethod: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'
): NextMiddleware<any> => {
  return async function (req, res, next) {
    if (req.method === httpMethod || req.method === 'OPTIONS') {
      await next();
    } else {
      res.status(404);
      res.end();
    }
  };
};
