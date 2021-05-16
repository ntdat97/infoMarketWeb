import { firebaseAdmin } from "../../../../fb/firebaseAdmin";
import prisma from "../../../../libs/prisma";
import { use } from "../../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../../libs/middleware/utils/allowedHttpMethod";
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const getMedia = async (req: any, res: NextApiResponse) => {
  const slug = req.query.slug as string;
  const status = req.query.status as string;
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const role = decoded.role;
  console.log(slug);

  if (status === "all") {
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
            paidState: false,
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
              createdAt: "desc",
            },
            where: {
              project: {
                slug: slug,
              },
              paidState: false,
            },
            include: {
              user: true,
              project: true,
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
  } else if (status === "pending") {
    if (role[0] === "ADMIN") {
      try {
        const getMediaBySlug = await prisma.media.findMany({
          orderBy: {
            updatedAt: "desc",
          },
          where: {
            isApprove: "PENDING",
            project: {
              slug: slug,
            },
            paidState: false,
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
              isApprove: "PENDING",
              project: {
                slug: slug,
              },
              paidState: false,
            },
            include: {
              user: true,
              project: true,
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
  } else if (status === "approve") {
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
            isApprove: "APPROVE",
            paidState: false,
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
              isApprove: "APPROVE",
              paidState: false,
            },
            include: {
              user: true,
              project: true,
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
  } else if (status === "reject") {
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
            isApprove: "REJECT",
            paidState: false,
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
              isApprove: "REJECT",
              paidState: false,
            },
            include: {
              user: true,
              project: true,
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
  } else if (status === "paid") {
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
            paidState: true,
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
              paidState: true,
            },
            include: {
              user: true,
              project: true,
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
  }
};

export default use(
  allowedHttpMethod("GET"),
  addRequestId,
  addUserIdAndRole
)(getMedia);
