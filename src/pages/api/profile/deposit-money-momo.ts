import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { NextApiResponse } from "next";
import { nanoid } from "nanoid";

const DepositMoney = async (req: any, res: NextApiResponse) => {
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const data = req.body.data.values;
  const momoTransactionIdGenerator = nanoid(12);
  try {
    const CheckMomoTransaction = await prisma.momoTransaction.count({
      where: {
        transactionId: data.tranId,
      },
    });
    if (CheckMomoTransaction === 0) {
      const getCurrentPoint = await prisma.user.findFirst({
        select: {
          point: true,
        },
        where: {
          id: decoded.uid,
        },
      });
      const CreateMomoTransaction = prisma.momoTransaction.create({
        data: {
          transactionId: data.tranId,
          data: data,
          id: momoTransactionIdGenerator,
        },
      });
      const CreateUserDepositRecorder = prisma.userDepositRecorder.create({
        data: {
          amount: parseFloat(data.amount),
          userId: decoded.uid,
          availableDepositMethodId: "momo",
          momoTransactionId: momoTransactionIdGenerator,
        },
      });
      const UpdatePointUser = prisma.user.update({
        where: {
          id: decoded.uid,
        },
        data: {
          point: getCurrentPoint.point + parseFloat(data.amount),
        },
      });
      const result = await prisma.$transaction([
        CreateMomoTransaction,
        CreateUserDepositRecorder,
        UpdatePointUser,
      ]);
      console.log(result);
      return res.status(201).send({ statusPayment: "ok", msg: "Thành công" });
    } else {
      return res.status(201).send({
        statusPayment: "used",
        msg: "Mã giao dịch này đã được sử dung",
      });
    }
  } catch (error) {
    console.log(error);
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
