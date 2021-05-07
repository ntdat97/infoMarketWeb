import { use } from "../../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../../libs/middleware/utils/allowedHttpMethod";
import { firebaseAdmin } from "../../../../fb/firebaseAdmin";
import prisma from "../../../../libs/prisma";
import { NextApiResponse } from "next";

const MemberCountAPI = async (req: any, res: NextApiResponse) => {
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const role = decoded.role;
  if (role[0] === "ADMIN") {
    const totalMembersStatusALL = await prisma.user.count();

    const totalMemberStatusACTIVE = await prisma.user.count({
      where: {
        userState: {
          equals: "ACTIVE",
        },
      },
    });

    const totalMembersStatusBANNED = await prisma.user.count({
      where: {
        userState: {
          equals: "BANNED",
        },
      },
    });

    return res.status(200).send([
      {
        totalMembersStatusALL,
        totalMemberStatusACTIVE,
        totalMembersStatusBANNED,
      },
    ]);
  } else {
    return res.status(200).send({ message: "You are not Authourize" });
  }
};
export default use(
  allowedHttpMethod("GET"),
  addRequestId,
  addUserIdAndRole
)(MemberCountAPI);
