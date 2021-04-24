import Boom from "@hapi/boom";
import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../libs/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    res.status(201).json({});
  }

  if (req.method === "GET") {
    res.status(200).json({});
  }

  if (req.method === "POST") {
    const authValue = req.headers.authorization;
    if (!authValue) {
      return res.status(400).json(Boom.badRequest());
    }
    const token = authValue.replace("Bearer ", "");
    const decoded = await firebaseAdmin.auth().verifyIdToken(token);
    const userId = decoded.uid;
    console.log(decoded);
    const createUser = await prisma.user.create({
      data: {
        id: userId,
        email: decoded.email,
        providers: decoded.firebase.sign_in_provider,
      },
    });

    await firebaseAdmin
      .auth()
      .setCustomUserClaims(userId, { is_save_user: true, role: ["USER"] });

    return res.status(201).json({
      success: "1",
      data: createUser,
    });
  }

  if (req.method === "DELETE") {
    res.status(204).json({});
  }
};
