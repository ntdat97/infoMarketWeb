import { isApprove } from "@prisma/client";
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
      getAllMediaByStatus = await prisma.media.findMany({
        orderBy: {
          updatedAt: "desc",
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
          isApprove: {
            equals: isApprove.PENDING,
          },
          paidState: false,
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
          isApprove: {
            equals: isApprove.APPROVE,
          },
          paidState: false,
        },
        include: {
          user: true,
          project: true,
        },
      });
    } else if (status === "rejected") {
      getAllMediaByStatus = await prisma.media.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          isApprove: {
            equals: isApprove.REJECT,
          },
          paidState: false,
        },
        include: {
          user: true,
          project: true,
        },
      });
    } else if (status === "paid") {
      getAllMediaByStatus = await prisma.media.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          paidState: true,
        },
        include: {
          user: true,
          project: true,
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
