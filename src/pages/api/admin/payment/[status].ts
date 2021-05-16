import { WithdrawPointState } from "@prisma/client";
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
  let getAllWithdrawByStatus;
  if (role[0] === "ADMIN") {
    if (status === "all") {
      getAllWithdrawByStatus = await prisma.userWithdrawRecorder.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          userPaymentMethod: true,
        },
      });
    } else if (status === "paying") {
      getAllWithdrawByStatus = await prisma.userWithdrawRecorder.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          withdrawPointState: WithdrawPointState.PAYING,
        },
        include: {
          user: true,
          userPaymentMethod: true,
        },
      });
    } else if (status === "paid") {
      getAllWithdrawByStatus = await prisma.userWithdrawRecorder.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          withdrawPointState: WithdrawPointState.PAID,
        },
        include: {
          user: true,
          userPaymentMethod: true,
        },
      });
    } else if (status === "reject") {
      getAllWithdrawByStatus = await prisma.userWithdrawRecorder.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          withdrawPointState: WithdrawPointState.REJECT,
        },
        include: {
          user: true,
          userPaymentMethod: true,
        },
      });
    }

    return res.status(200).send(getAllWithdrawByStatus);
  } else {
    return res.status(200).send({ message: "You are not Authourize" });
  }
};

export default use(
  allowedHttpMethod("GET"),
  addRequestId,
  addUserIdAndRole
)(PostsAPI);
