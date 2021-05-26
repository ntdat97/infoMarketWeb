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
  let getAllDepositByStatus;
  if (role[0] === "ADMIN") {
    if (status === "all") {
      getAllDepositByStatus = await prisma.userDepositRecorder.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          momoTransaction: true,
        },
      });
    }
    return res.status(200).send(getAllDepositByStatus);
  } else {
    return res.status(200).send({ message: "You are not Authourize" });
  }
};

export default use(
  allowedHttpMethod("GET"),
  addRequestId,
  addUserIdAndRole
)(PostsAPI);
