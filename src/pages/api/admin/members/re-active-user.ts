import { Project, userState } from "@prisma/client";
import { firebaseAdmin } from "../../../../fb/firebaseAdmin";
import prisma from "../../../../libs/prisma";
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const apiRoute = nextConnect({
  onError(error, req, res: NextApiResponse) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.get(async (req: any, res: NextApiResponse) => {
  const username = req.query.username as string;
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const role = decoded.role;
  if (role[0] === "ADMIN") {
    try {
      const banUser = await prisma.user.update({
        where: {
          username: username,
        },
        data: {
          userState: userState.ACTIVE,
          updatedAt: new Date().toISOString(),
        },
      });
      const getProfile = await prisma.user.findFirst({
        where: {
          username: username,
        },
      });
      await firebaseAdmin.auth().setCustomUserClaims(getProfile.id, {
        userState: ["ACTIVE"],
      });
      res.status(200).json({
        success: "1",
        data: banUser,
      });
    } catch (error) {
      console.log(error);

      res.status(400).json({
        success: "0",
        data: error,
      });
    }
  } else {
    return res.status(200).send({ message: "You are not Authourize" });
  }
});

export default apiRoute;
