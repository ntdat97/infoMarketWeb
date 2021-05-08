import { Status } from "@prisma/client";
import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import { isAdmin } from "../../../libs/middleware/utils/isAdmin";
import { isAuth } from "../../../libs/middleware/utils/isAuth";
import prisma from "../../../libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const AdminPostsAPI = async (
  req: NextApiRequest & { uid: string; role: string; username: string },
  res: NextApiResponse
) => {
  const authorId: string = req.query.authorId as string;
  let getUserProfile = {};
  // guest view
  if (!req.uid) {
    getUserProfile = await prisma.user.findUnique({
      where: { id: authorId },
      include: {
        userPaymentMethod: {
          where: {
            paymentState: "LIVE",
          },
        },
      },
    });
  }

  // user view
  if (req.uid && req.role.includes("USER")) {
  }

  // admin view
  if (req.uid && req.role.includes("ADMIN")) {
  }

  return res.status(200).send([getUserProfile]);
};

export default use(allowedHttpMethod("GET"))(AdminPostsAPI);
