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
    },
  });

  return res.status(200).send([
    {
      totalMediaStatusALL,
      totalMediaStatusAPPROVE,
      totalMediaStatusPENDING,
      totalMediaStatusREJECT,
    },
  ]);
};
export default use(allowedHttpMethod("GET"))(PostsCountByStatusAPI);
