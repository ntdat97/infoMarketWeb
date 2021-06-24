import { use } from "../../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../../libs/middleware/utils/allowedHttpMethod";
import { firebaseAdmin } from "../../../../fb/firebaseAdmin";
import prisma from "../../../../libs/prisma";
import { NextApiResponse } from "next";

const PostsCountByStatusAPI = async (req: any, res: NextApiResponse) => {
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const role = decoded.role;
  console.log(role);
  if (role[0] === "ADMIN") {
    const totalMediaStatusALL = await prisma.media.count();

    const totalMediaStatusPENDING = await prisma.media.count({
      where: {
        isApprove: {
          equals: "PENDING",
        },
        paidState: false,
      },
    });

    const totalMediaStatusAPPROVE = await prisma.media.count({
      where: {
        isApprove: {
          equals: "APPROVE",
        },
        paidState: false,
      },
    });

    const totalMediaStatusREJECT = await prisma.media.count({
      where: {
        isApprove: {
          equals: "REJECT",
        },
        paidState: false,
      },
    });
    const totalMediaStatusPAID = await prisma.media.count({
      where: {
        paidState: true,
      },
    });
    return res.status(200).send([
      {
        totalMediaStatusALL,
        totalMediaStatusAPPROVE,
        totalMediaStatusPENDING,
        totalMediaStatusREJECT,
        totalMediaStatusPAID,
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
)(PostsCountByStatusAPI);
