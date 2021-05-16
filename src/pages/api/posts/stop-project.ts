import { Project, Status, isComplete } from "@prisma/client";
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

apiRoute.get(async (req: any, res: NextApiResponse) => {
  const slug = req.query.slug as string;
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const role = decoded.role;
  if (role[0] === "ADMIN") {
    try {
      const updatePost = await prisma.project.update({
        where: {
          slug: slug,
        },
        data: {
          complete: isComplete.PAUSE,
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
  } else {
    try {
      const getPostByPublic = await prisma.project.findFirst({
        where: {
          slug: {
            equals: slug,
          },
        },
      });
      if (!getPostByPublic) {
        return res.status(400).json({ message: "Data is empty.", id: "empty" });
      }
      if (getPostByPublic.authorId === decoded.uid) {
        try {
          const updatePost = await prisma.project.update({
            where: {
              slug: slug,
            },
            data: {
              complete: isComplete.PAUSE,
              updatedAt: new Date().toISOString(),
            },
          });
          console.log(slug);
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
      } else {
        return res
          .status(200)
          .json({ message: "Not Authorization", id: "unauth" });
      }
    } catch (error) {
      console.log(error);

      res.status(400).json({
        success: "0",
        data: error,
      });
    }
  }
});

export default apiRoute;
