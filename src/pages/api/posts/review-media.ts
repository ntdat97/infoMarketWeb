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
  const slug = req.query.slug as string;

  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const role = decoded.role;
  const inputPostData = req.body;
  const parseData = JSON.parse(inputPostData);
  console.log(parseData);
  if (role[0] === "ADMIN") {
    try {
      const updateBatchPending = await prisma.media.updateMany({
        where: {
          id: {
            in: parseData.listImagePending,
          },
        },
        data: {
          isApprove: "PENDING",
          updatedAt: new Date().toISOString(),
        },
      });
      const updateBatchReject = await prisma.media.updateMany({
        where: {
          id: {
            in: parseData.listImageReject,
          },
        },
        data: {
          isApprove: "REJECT",
          updatedAt: new Date().toISOString(),
        },
      });
      const updateBatchApprove = await prisma.media.updateMany({
        where: {
          id: {
            in: parseData.listImageApprove,
          },
        },
        data: {
          isApprove: "APPROVE",
          updatedAt: new Date().toISOString(),
        },
      });
      return res
        .status(200)
        .json([updateBatchPending, updateBatchReject, updateBatchApprove]);
    } catch (error) {
      // console.log(error);

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
      if (getPostByPublic.authorId === decoded.uid) {
        const updateBatchPending = await prisma.media.updateMany({
          where: {
            id: {
              in: parseData.listImagePending,
            },
          },
          data: {
            isApprove: "PENDING",
            updatedAt: new Date().toISOString(),
          },
        });
        const updateBatchReject = await prisma.media.updateMany({
          where: {
            id: {
              in: parseData.listImageReject,
            },
          },
          data: {
            isApprove: "REJECT",
            updatedAt: new Date().toISOString(),
          },
        });
        const updateBatchApprove = await prisma.media.updateMany({
          where: {
            id: {
              in: parseData.listImageApprove,
            },
          },
          data: {
            isApprove: "APPROVE",
            updatedAt: new Date().toISOString(),
          },
        });
        if (!getPostByPublic) {
          return res
            .status(400)
            .json({ message: "Data is empty.", id: "empty" });
        }

        return res
          .status(200)
          .json([updateBatchPending, updateBatchReject, updateBatchApprove]);
      }
      return res
        .status(200)
        .json({ message: "Not Authorization", id: "unauth" });
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
