import { Project } from "@prisma/client";
import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import prisma from "../../../libs/prisma";
import { genSlug } from "../../../libs/slugify";
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
  const userId = decoded.uid;

  const inputPostData = req.body;
  // generate slug
  const slug = genSlug(inputPostData.data.projectName);
  try {
    const createPost = await prisma.project.create({
      data: {
        authorId: userId,
        authorName: decoded.name,
        slug,
        ...inputPostData.data,
      },
    });
    const temp = [];
    inputPostData.payment.map((item) => {
      temp.push({ ProjectPaymentMethodId: item, projectId: createPost.id });
    });
    const createPaymentMethod = await prisma.projectPaymentMethod.createMany({
      data: temp,
    });
    res.status(200).json({
      success: "1",
      data: [createPost, createPaymentMethod],
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
