import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { NextApiResponse } from "next";

const MePofileAPI = async (req: any, res: NextApiResponse) => {
  const slug = req.query.slug;
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const role = decoded.role;
  if (role[0] === "ADMIN") {
    const getProfile = await prisma.user.findFirst({
      where: {
        username: slug,
      },
      include: {
        _count: {
          select: { media: true, project: true },
        },
      },
    });
    const countApprove = await prisma.media.count({
      where: {
        user: {
          id: req.uid,
        },
        isApprove: "APPROVE",
      },
    });
    return res.status(200).send([getProfile, countApprove]);
  } else {
    return res.status(200).send({ messgae: "You are not Admin" });
  }
};

export default use(
  allowedHttpMethod("GET"),
  addRequestId,
  addUserIdAndRole
)(MePofileAPI);
