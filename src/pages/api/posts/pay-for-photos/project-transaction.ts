import { firebaseAdmin } from "../../../../fb/firebaseAdmin";
import { use } from "../../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../../libs/prisma";
import { NextApiResponse } from "next";
import { nanoid } from "nanoid";

const DepositMoney = async (req: any, res: NextApiResponse) => {
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const data = req.body.data;

  const projectTransactionIdGenerator = nanoid(12);
  var listMediaId = [];
  data.senderPhotosData.map((item) => {
    listMediaId.push(item.id);
  });
  try {
    const getCurrentPointSender = await prisma.user.findFirst({
      select: {
        point: true,
      },
      where: {
        id: data.senderPhotosData[0].userId,
      },
    });
    const getCurrentPointReceiver = await prisma.user.findFirst({
      select: {
        point: true,
      },
      where: {
        id: decoded.uid,
      },
    });
    if (data.sumAmount > getCurrentPointReceiver.point) {
      return res.status(403).send({
        msg: "Bạn không đủ tiền để thanh toán",
      });
    }
    if (decoded.uid === data.senderPhotosData[0].userId) {
      return res.status(403).send({
        msg: "Bạn không thể thanh toán cho chính mình",
      });
    }
    const CreateProjectTransaction = prisma.projectTransactionRecorder.create({
      data: {
        senderUserId: data.senderPhotosData[0].userId,
        receiverUserId: decoded.uid,
        sumAmount: data.sumAmount,
        projectId: data.senderPhotosData[0].projectId,
        id: projectTransactionIdGenerator,
      },
    });
    const UpdatePointSender = prisma.user.update({
      where: {
        id: data.senderPhotosData[0].userId,
      },
      data: {
        point: getCurrentPointSender.point + data.sumAmount,
      },
    });
    const UpdatePointReceiver = prisma.user.update({
      where: {
        id: decoded.uid,
      },
      data: {
        point: getCurrentPointReceiver.point - data.sumAmount,
      },
    });
    const UpdateBatchMedia = prisma.media.updateMany({
      where: {
        id: { in: listMediaId },
      },
      data: {
        projectTransactionRecorderId: projectTransactionIdGenerator,
        paidState: true,
        paidDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    const result = await prisma.$transaction([
      CreateProjectTransaction,
      UpdatePointSender,
      UpdatePointReceiver,
      UpdateBatchMedia,
    ]);
    return res.status(201).send({ statusPayment: "ok", msg: "Thành công" });
  } catch (error) {
    //console.log(error)
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
