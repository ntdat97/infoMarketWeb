import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { NextApiResponse } from "next";

const UpdatePofileAPI = async (req: any, res: NextApiResponse) => {
  console.log(req.query.paymentId);
  const paymentId: string = req.query.paymentId;
  console.log(paymentId);
  const findUserbyPaymentId = await prisma.userPaymentMethod.findFirst({
    where: {
      id: paymentId,
    },
    include: {
      user: true,
    },
  });
  if (findUserbyPaymentId.user.id === req.uid) {
    const updatePayment = await prisma.userPaymentMethod.update({
      where: {
        id: paymentId,
      },
      data: {
        paymentState: "DELETED",
      },
    });
    return res.status(201).send(updatePayment);
  } else {
    return res.status(201).send({ message: "You are not auth" });
  }
};

export default use(
  allowedHttpMethod("GET"),
  addRequestId,
  addUserIdAndRole
)(UpdatePofileAPI);
