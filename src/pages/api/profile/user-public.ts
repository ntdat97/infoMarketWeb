import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { NextApiResponse } from "next";
import { isApprove } from ".prisma/client";

const PublicPofileAPI = async (req: any, res: NextApiResponse) => {
  const username = req.query.username;
  const getProfile = await prisma.user.findFirst({
    select: {
      email: true,
      name: true,
      userState: true,
      photoURL: true,
      bio: true,
      website: true,
      _count: {
        select: { media: true, project: true },
      },
    },
    where: {
      username: username,
    },
  });
  const countApprove = await prisma.media.count({
    where: {
      user: {
        username: username,
      },
      isApprove: "APPROVE",
    },
  });

  return res.status(200).send([getProfile, countApprove]);
};

export default use(allowedHttpMethod("GET"))(PublicPofileAPI);
