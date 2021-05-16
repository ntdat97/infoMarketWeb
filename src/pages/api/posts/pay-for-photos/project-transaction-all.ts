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
  const getCurrentPointReceiverTotal = await prisma.user.findFirst({
    select: {
      point: true,
    },
    where: {
      id: decoded.uid,
    },
  });

  if (data.sumAmount <= getCurrentPointReceiverTotal.point) {
    var success = 0,
      fail = 0;
    for (const item of data.senderPhotosData) {
      const sumAmount = item.length * item[0].project?.price;
      const projectTransactionIdGenerator = nanoid(12);
      var listMediaId = [];
      item.map((item1) => {
        listMediaId.push(item1.id);
      });
      try {
        const getCurrentPointSender = await prisma.user.findFirst({
          select: {
            point: true,
          },
          where: {
            id: item[0].userId,
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
        console.log(getCurrentPointReceiver);
        if (decoded.uid === item[0].userId) {
          fail = fail + 1;
          break;
        }
        const CreateProjectTransaction =
          prisma.projectTransactionRecorder.create({
            data: {
              senderUserId: item[0].userId,
              receiverUserId: decoded.uid,
              sumAmount: sumAmount,
              projectId: item[0].projectId,
              id: projectTransactionIdGenerator,
            },
          });
        const UpdatePointSender = prisma.user.update({
          where: {
            id: item[0].userId,
          },
          data: {
            point: getCurrentPointSender.point + sumAmount,
          },
        });
        const UpdatePointReceiver = prisma.user.update({
          where: {
            id: decoded.uid,
          },
          data: {
            point: getCurrentPointReceiver.point - sumAmount,
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
        success = success + 1;
      } catch (error) {
        //console.log(error)
        fail = fail + 1;
      }
    }
    console.log(success + "|" + fail);
    return res.status(200).send([success, fail]);
  } else {
    return res.status(403).send({
      msg: "Bạn không đủ tiền để thanh toán",
    });
  }
};

export default use(
  allowedHttpMethod("POST"),
  addRequestId,
  addUserIdAndRole
)(DepositMoney);
