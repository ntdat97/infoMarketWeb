import { isApprove, userState } from "@prisma/client";
import { firebaseAdmin } from "../../../../fb/firebaseAdmin";
import { use } from "../../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../../libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const getUserInfo = async (
  req: NextApiRequest & { uid: string },
  res: NextApiResponse
) => {
  const id: string = req.query.id as string;
  var role = [];
  try {
    const getUserState = await prisma.user.findFirst({
      select: {
        userState: true,
        role: true,
      },
      where: {
        id: id,
      },
    });
    role.push(getUserState.role);
    await firebaseAdmin.auth().setCustomUserClaims(id, {
      role: role,
    });
    if (!getUserState) {
      return res.status(400).json({ message: "Data is empty.", id: "empty" });
    }
    return res.status(200).send(getUserState);
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: "0",
      data: error,
    });
  }
};

export default use(allowedHttpMethod("GET"))(getUserInfo);
