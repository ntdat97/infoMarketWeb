import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { NextApiResponse } from "next";

const PostsCountByStatusAPI = async (req: any, res: NextApiResponse) => {
  const totalPostsStatusALL = await prisma.project.count({
    where: {
      authorId: req.uid,
    },
  });

  const totalPostsStatusPENDING = await prisma.project.count({
    where: {
      authorId: req.uid,
      status: {
        equals: "PENDING",
      },
    },
  });

  const totalPostsStatusPUBLISHED = await prisma.project.count({
    where: {
      authorId: req.uid,
      status: {
        equals: "PUBLISHED",
      },
    },
  });

  const totalPostsStatusDELETED = await prisma.project.count({
    where: {
      authorId: req.uid,
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
  addUserIdAndRole
)(PostsCountByStatusAPI);
