import prisma from 'libs/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
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

apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query.slug as string;

  try {
    const getPublishedPost = await prisma.post.findFirst({
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: 'PUBLISHED',
        },
      },
      include: {
        author: true,
        topic: true,
      },
    });

    if (!getPublishedPost) {
      return res.status(400).json({ message: 'Data is empty.' });
    }

    res.status(200).json(getPublishedPost);
  } catch (error) {
    // console.log(error);

    res.status(400).json({
      success: '0',
      data: error,
    });
  }
});

export default apiRoute;
