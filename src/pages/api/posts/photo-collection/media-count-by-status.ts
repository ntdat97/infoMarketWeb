import { use } from "../../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../../libs/prisma";
import { NextApiResponse } from "next";
import { firebaseAdmin } from "../../../../fb/firebaseAdmin";

const PostsCountByStatusAPI = async (req: any, res: NextApiResponse) => {
  const slug = req.query.slug as string;
  /*   const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const role = decoded.role; */
  const totalMediaStatusALL = await prisma.media.count({
    where: {
      project: {
        slug: slug,
      },
      paidState: false,
    },
  });

  const totalMediaStatusPENDING = await prisma.media.count({
    where: {
      project: {
        slug: slug,
      },
      isApprove: {
        equals: "PENDING",
      },
      paidState: false,
    },
  });

  const totalMediaStatusAPPROVE = await prisma.media.count({
    where: {
      project: {
        slug: slug,
      },
      isApprove: {
        equals: "APPROVE",
      },
      paidState: false,
    },
  });

  const totalMediaStatusREJECT = await prisma.media.count({
    where: {
      project: {
        slug: slug,
      },
      isApprove: {
        equals: "REJECT",
      },
      paidState: false,
    },
  });
  const totalMediaStatusPAID = await prisma.media.count({
    where: {
      project: {
        slug: slug,
      },
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
};
export default use(allowedHttpMethod("GET"))(PostsCountByStatusAPI);
