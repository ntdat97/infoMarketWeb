import { use } from './nextMiddleware';
import { allowedHttpMethod } from './utils/allowedHttpMethod';
import { addUserIdAndRole } from './utils/addUserIdAndRole';
import { addRequestId } from './utils/addRequestId';

export const withAuthMiddleware = use(
  allowedHttpMethod('GET'),
  addRequestId,
  addUserIdAndRole
);
