import { WithdrawPointState } from "@prisma/client";
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
    const totalWithdrawStatusALL = await prisma.userWithdrawRecorder.count();

    const totalWithdrawStatusPAYING = await prisma.userWithdrawRecorder.count({
      where: {
        withdrawPointState: WithdrawPointState.PAYING,
      },
    });
    const totalWithdrawStatusPAID = await prisma.userWithdrawRecorder.count({
      where: {
        withdrawPointState: WithdrawPointState.PAID,
      },
    });

    const totalWithdrawStatusREJECT = await prisma.userWithdrawRecorder.count({
      where: {
        withdrawPointState: WithdrawPointState.REJECT,
      },
    });

    return res.status(200).send([
      {
        totalWithdrawStatusALL,
        totalWithdrawStatusPAYING,
        totalWithdrawStatusPAID,
        totalWithdrawStatusREJECT,
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
