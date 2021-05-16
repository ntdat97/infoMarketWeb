import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { NextApiResponse } from "next";

const MePofileAPI = async (req: any, res: NextApiResponse) => {
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const getProfile = await prisma.user.findFirst({
    where: {
      id: decoded.uid,
    },
    select: {
      userDepositRecorder: true,
      userWithdrawRecorder: true,
    },
  });

  return res.status(200).send(getProfile);
};

export default use(
  allowedHttpMethod("GET"),
  addRequestId,
  addUserIdAndRole
)(MePofileAPI);
