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
  const slug = req.query.slug as string;
  try {
    const getPostByPublic = await prisma.project.findFirst({
      where: {
        slug: {
          equals: slug,
        },
      },
      select: {
        status: true,
      },
    });

    // console.log(userId);

    // console.log(getPostByUserId);

    if (!getPostByPublic) {
      return res.status(400).json({ message: "Data is empty.", id: "empty" });
    }

    return res.status(200).json(getPostByPublic);
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: "0",
      data: error,
    });
  }
});

export default apiRoute;
