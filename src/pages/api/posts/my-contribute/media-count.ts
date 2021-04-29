import { use } from "../../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../../libs/prisma";
import { NextApiResponse } from "next";

const PostsCountByStatusAPI = async (req: any, res: NextApiResponse) => {
  const totalMediaStatusALL = await prisma.media.count({
    where: {
      userId: req.uid,
    },
  });

  const totalMediaStatusPENDING = await prisma.media.count({
    where: {
      userId: req.uid,
      isApprove: {
        equals: "PENDING",
      },
    },
  });

  const totalMediaStatusAPPROVE = await prisma.media.count({
    where: {
      userId: req.uid,
      isApprove: {
        equals: "APPROVE",
      },
    },
  });

  const totalMediaStatusREJECT = await prisma.media.count({
    where: {
      userId: req.uid,
      isApprove: {
        equals: "REJECT",
      },
    },
  });

  return res.status(200).send([
    {
      totalMediaStatusALL,
      totalMediaStatusAPPROVE,
      totalMediaStatusPENDING,
      totalMediaStatusREJECT,
    },
  ]);
};
export default use(
  allowedHttpMethod("GET"),
  addRequestId,
  addUserIdAndRole
)(PostsCountByStatusAPI);
