import { firebaseAdmin } from "../../../../fb/firebaseAdmin";
import prisma from "../../../../libs/prisma";
import { use } from "../../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../../libs/middleware/utils/allowedHttpMethod";
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const PayForPhotos = async (req: any, res: NextApiResponse) => {
  const slug = req.query.slug as string;
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const role = decoded.role;
  console.log(slug);
  if (role[0] === "ADMIN") {
    try {
      const getMediaBySlug = await prisma.media.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          project: {
            slug: slug,
          },
        },
        include: {
          user: true,
          project: true,
        },
      });

      if (!getMediaBySlug) {
        return res.status(400).json({ message: "Data is empty." });
      }

      return res.status(200).json(getMediaBySlug);
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
          slug: slug,
        },
      });
      if (getPostByPublic.authorId === decoded.uid) {
        const getMediaBySlug = await prisma.media.findMany({
          orderBy: {
            updatedAt: "desc",
          },
          where: {
            project: {
              slug: slug,
            },
          },
          include: {
            user: true,
            project: true,
            userPaymentMethod: true,
          },
        });
        if (!getMediaBySlug) {
          return res
            .status(400)
            .json({ message: "Data is empty.", id: "empty" });
        }

        return res.status(200).json(getMediaBySlug);
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
};

export default use(
  allowedHttpMethod("GET"),
  addRequestId,
  addUserIdAndRole
)(PayForPhotos);
