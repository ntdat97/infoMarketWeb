import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { NextApiResponse } from "next";

const AddPaymentAPI = async (req: any, res: NextApiResponse) => {
  const data = req.body.data.values;
  try {
    const addPayment = await prisma.userPaymentMethod.create({
      data: {
        userPaymentMethodId: data.id,
        name: data.name,
        phone: data.phone,
        stk: data.stk,
        userId: req.uid,
      },
    });

    return res.status(201).send(addPayment);
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
)(AddPaymentAPI);
