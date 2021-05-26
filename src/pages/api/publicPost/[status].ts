import { Status } from "@prisma/client";
import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const PostsAPI = async (
  req: NextApiRequest & { uid: string },
  res: NextApiResponse
) => {
  const status: string = req.query.status as string;

  let getAllPostsByStatus;
  if (status === "all") {
    getAllPostsByStatus = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            photoURL: true,
            name: true,
            username: true,
            email: true,
            bio: true,
            website: true,
          },
        },
      },
    });
  } else if (status === "pending") {
    getAllPostsByStatus = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        authorId: req.uid,
        status: {
          equals: Status.PENDING,
        },
      },
    });
  } else if (status === "published") {
    getAllPostsByStatus = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        authorId: req.uid,
        status: {
          equals: Status.PUBLISHED,
        },
      },
    });
  } else if (status === "deleted") {
    getAllPostsByStatus = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        authorId: req.uid,
        status: {
          equals: Status.DELETED,
        },
      },
    });
  }

  return res.status(200).send(getAllPostsByStatus);
};

export default use(allowedHttpMethod("GET"))(PostsAPI);
