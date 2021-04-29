import { Status } from "@prisma/client";
import { use } from "../../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../../libs/middleware/utils/allowedHttpMethod";
import { isAdmin } from "../../../../libs/middleware/utils/isAdmin";
import { isAuth } from "../../../../libs/middleware/utils/isAuth";
import prisma from "../../../../libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const AdminPostsAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  const status: string = req.query.status as string;
  // console.log(status);

  let getAllPostsByStatus;
  if (status === "all") {
    getAllPostsByStatus = await prisma.project.findMany({
      // select: { id: true, slug: true },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        author: true,
      },
    });
  } else if (status === "pending") {
    getAllPostsByStatus = await prisma.project.findMany({
      // select: { id: true, slug: true },
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        status: {
          equals: Status.PENDING,
        },
      },
      include: {
        author: true,
      },
    });
  } else if (status === "published") {
    getAllPostsByStatus = await prisma.project.findMany({
      // select: { id: true, slug: true },
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        status: {
          equals: Status.PUBLISHED,
        },
      },
      include: {
        author: true,
      },
    });
  } else if (status === "deleted") {
    getAllPostsByStatus = await prisma.project.findMany({
      // select: { id: true, slug: true },
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        status: {
          equals: Status.DELETED,
        },
      },
      include: {
        author: true,
      },
    });
  }

  return res.status(200).send(getAllPostsByStatus);
};

export default use(
  allowedHttpMethod("GET"),
  addRequestId,
  addUserIdAndRole,
  isAuth,
  isAdmin
)(AdminPostsAPI);
