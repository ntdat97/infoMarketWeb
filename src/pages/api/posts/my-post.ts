import { firebaseAdmin } from 'fb/firebaseAdmin';
import prisma from 'libs/prisma';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';

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
  // console.log(req.headers);

  const status: any = req.query.status as string;
  const authValue = req.headers.authorization;
  const token = authValue.replace('Bearer ', '');
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const userId = decoded.uid;

  try {
    const getMyPosts = await prisma.post.findMany({
      where: {
        authorId: {
          equals: userId,
        },
        status: {
          equals: status,
        },
      },
      include: {
        author: true,
        topic: true,
      },
    });

    if (!getMyPosts) {
      return res.status(400).json({ message: 'Data is empty.' });
    }

    return res.status(200).json(getMyPosts);
  } catch (error) {
    // console.log(error);

    res.status(400).json({
      success: '0',
      data: error,
    });
  }
});

export default apiRoute;
