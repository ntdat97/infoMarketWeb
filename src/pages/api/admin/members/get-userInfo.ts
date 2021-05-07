import { isApprove, userState } from "@prisma/client";
import { firebaseAdmin } from "../../../../fb/firebaseAdmin";
import { use } from "../../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../../libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const getUserInfo = async (
  req: NextApiRequest & { uid: string },
  res: NextApiResponse
) => {
  const id: string = req.query.id as string;
  const getUserState = await prisma.user.findUnique({
    select: {
      userState: true,
    },
    where: {
      id: id,
    },
  });
  return res.status(200).send(getUserState);
};

export default use(allowedHttpMethod("GET"))(getUserInfo);
