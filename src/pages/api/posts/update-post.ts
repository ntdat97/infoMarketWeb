import { Project } from "@prisma/client";
import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import prisma from "../../../libs/prisma";
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

apiRoute.post(async (req: any, res: NextApiResponse) => {
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const inputPost = req.body;
  const inputPostData = req.body.data;
  try {
    const updatePost = await prisma.project.update({
      where: {
        slug: inputPost.slug,
      },
      data: {
        ...inputPostData,
        status: "PENDING",
        updatedAt: new Date().toISOString(),
      },
    });

    res.status(200).json({
      success: "1",
      data: updatePost,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: "0",
      data: error,
    });
  }
});

export default apiRoute;
