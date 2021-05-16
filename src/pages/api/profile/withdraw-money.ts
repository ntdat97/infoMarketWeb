import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { NextApiResponse } from "next";

const DepositMoney = async (req: any, res: NextApiResponse) => {
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const data = req.body.data;
  try {
    const getCurrentPoint = await prisma.user.findFirst({
      select: {
        point: true,
      },
      where: {
        id: decoded.uid,
      },
    });
    if (data.amount <= getCurrentPoint.point) {
      const CreateUserWithdrawRecorder = prisma.userWithdrawRecorder.create({
        data: {
          amount: parseFloat(data.amount),
          userId: decoded.uid,
          userPaymentMethodId: data.method,
        },
      });

      const UpdatePointUser = prisma.user.update({
        where: {
          id: decoded.uid,
        },
        data: {
          point: getCurrentPoint.point - parseFloat(data.amount),
        },
      });
      const result = await prisma.$transaction([
        CreateUserWithdrawRecorder,
        UpdatePointUser,
      ]);
      return res.status(201).send({ statusPayment: "ok", msg: "Thành công" });
    } else {
      return res
        .status(401)
        .send({ statusPayment: "ok", msg: "Bạn không đủ tiền để rút" });
    }
  } catch (error) {
    //console.log(error);
    res.status(400).json({
      success: "0",
      data: error,
    });
  }
};

export default use(
  allowedHttpMethod("POST"),
  addRequestId,
  addUserIdAndRole
)(DepositMoney);
