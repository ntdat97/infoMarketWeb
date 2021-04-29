import { use } from "../../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../../libs/middleware/utils/allowedHttpMethod";
import { isAdmin } from "../../../../libs/middleware/utils/isAdmin";
import { isAuth } from "../../../../libs/middleware/utils/isAuth";
import prisma from "../../../../libs/prisma";
import { NextApiResponse } from "next";

const AdminPostsCountByStatusAPI = async (_req: any, res: NextApiResponse) => {
  const totalPostsStatusALL = await prisma.project.count();

  const totalPostsStatusPENDING = await prisma.project.count({
    where: {
      status: {
        equals: "PENDING",
      },
    },
  });

  const totalPostsStatusPUBLISHED = await prisma.project.count({
    where: {
      status: {
        equals: "PUBLISHED",
      },
    },
  });

  const totalPostsStatusDELETED = await prisma.project.count({
    where: {
      status: {
        equals: "DELETED",
      },
    },
  });

  return res.status(200).send([
    {
      totalPostsStatusALL,
      totalPostsStatusPENDING,
      totalPostsStatusPUBLISHED,
      totalPostsStatusDELETED,
    },
  ]);
};

export default use(
  allowedHttpMethod("GET"),
  addRequestId,
  addUserIdAndRole,
  isAuth,
  isAdmin
)(AdminPostsCountByStatusAPI);
