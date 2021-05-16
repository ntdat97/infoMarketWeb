import { use } from "../../../libs/middleware/nextMiddleware";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { NextApiResponse } from "next";

const PayemntMethodAPI = async (req: any, res: NextApiResponse) => {
  const getAllPayment = await prisma.availablePaymentMethod.findMany({});
  const getProvider = await prisma.availablePaymentMethod.findMany({
    where: {},
    distinct: ["provider"],
    select: {
      provider: true,
    },
  });
  return res.status(200).send([getAllPayment, getProvider]);
};

export default use(allowedHttpMethod("GET"))(PayemntMethodAPI);
