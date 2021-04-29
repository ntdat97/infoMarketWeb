import { isApprove } from "@prisma/client";
import { use } from "../../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../../libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const PostsAPI = async (
  req: NextApiRequest & { uid: string },
  res: NextApiResponse
) => {
  const status: string = req.query.status as string;
  let getAllMediaByStatus;
  if (status === "all") {
    getAllMediaByStatus = await prisma.media.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        userId: req.uid,
      },
      include: {
        user: true,
        project: true,
      },
    });
  } else if (status === "pending") {
    getAllMediaByStatus = await prisma.media.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        userId: req.uid,
        isApprove: {
          equals: isApprove.PENDING,
        },
      },
      include: {
        user: true,
        project: true,
      },
    });
  } else if (status === "approve") {
    getAllMediaByStatus = await prisma.media.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        userId: req.uid,
        isApprove: {
          equals: isApprove.APPROVE,
        },
      },
      include: {
        user: true,
        project: true,
      },
    });
  } else if (status === "deleted") {
    getAllMediaByStatus = await prisma.media.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        userId: req.uid,
        isApprove: {
          equals: isApprove.REJECT,
        },
      },
      include: {
        user: true,
        project: true,
      },
    });
  }

  return res.status(200).send(getAllMediaByStatus);
};

export default use(
  allowedHttpMethod("GET"),
  addRequestId,
  addUserIdAndRole
)(PostsAPI);
