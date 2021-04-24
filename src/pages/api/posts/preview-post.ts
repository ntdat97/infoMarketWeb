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
  
  const slug = req.query.slug as string;
  const authValue = req.headers.authorization;
  const token = authValue.replace('Bearer ', '');
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const userId = decoded.uid;
  const role = decoded.role;

  if (role.includes('ADMIN')) {
    try {
      const getPostByAdmin = await prisma.post.findFirst({
        where: {
          slug: {
            equals: slug,
          },
        },
        include: {
          author: true,
          topic: true,
        },
      });

      if (!getPostByAdmin) {
        return res.status(400).json({ message: 'Data is empty.' });
      }

      return res.status(200).json(getPostByAdmin);
    } catch (error) {
      // console.log(error);

      res.status(400).json({
        success: '0',
        data: error,
      });
    }
  }

  try {
    const getPostByUserId = await prisma.post.findFirst({
      where: {
        slug: {
          equals: slug,
        },
        authorId: {
          equals: userId,
        },
      },
      include: {
        author: true,
        topic: true,
      },
    });

    // console.log(userId);
    

    // console.log(getPostByUserId);
    
    if (!getPostByUserId) {
      return res.status(400).json({ message: 'Data is empty.' });
    }

    return res.status(200).json(getPostByUserId);
  } catch (error) {
    // console.log(error);

    res.status(400).json({
      success: '0',
      data: error,
    });
  }
});

export default apiRoute;
