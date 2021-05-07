import { isApprove, userState } from "@prisma/client";
import { firebaseAdmin } from "../../../../fb/firebaseAdmin";
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
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const role = decoded.role;
  let getAllMediaByStatus;
  if (role[0] === "ADMIN") {
    if (status === "all") {
      getAllMediaByStatus = await prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: { media: true, project: true },
          },
        },
      });
    } else if (status === "active") {
      getAllMediaByStatus = await prisma.user.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          userState: {
            equals: userState.ACTIVE,
          },
        },
        include: {
          _count: {
            select: { media: true, project: true },
          },
        },
      });
    } else if (status === "suspened") {
      getAllMediaByStatus = await prisma.user.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          userState: {
            equals: userState.SUSPENDED,
          },
        },
        include: {
          _count: {
            select: { media: true, project: true },
          },
        },
      });
    } else if (status === "banned") {
      getAllMediaByStatus = await prisma.user.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          userState: {
            equals: userState.BANNED,
          },
        },
        include: {
          _count: {
            select: { media: true, project: true },
          },
        },
      });
    }

    return res.status(200).send(getAllMediaByStatus);
  } else {
    return res.status(200).send({ message: "You are not Authourize" });
  }
};

export default use(
  allowedHttpMethod("GET"),
  addRequestId,
  addUserIdAndRole
)(PostsAPI);
