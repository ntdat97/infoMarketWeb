import { firebaseAdmin } from "../../../../../fb/firebaseAdmin";
import prisma from "../../../../../libs/prisma";
import { use } from "../../../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../../../libs/middleware/utils/allowedHttpMethod";
import { NextApiResponse } from "next";
const imageToBase64 = require("image-to-base64");
var Jimp = require("jimp");
const getMedia = async (req: any, res: NextApiResponse) => {
  const slug = req.query.slug as string;
  const status = req.query.status as string;
  const page = parseInt(req.query.page);
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const role = decoded.role;
  var skip = 50 * page - 50;
  var take = 50;

  if (status === "all") {
    if (role[0] === "ADMIN") {
      try {
        const getMediaBySlug = await prisma.mediaMap.findMany({
          /*            skip: skip,
          take: take, 
          orderBy: {
            createdAt: "desc",
          },*/
          where: {
            media: {
              project: {
                slug: slug,
              },
            },
          },
          include: {
            media: {
              include: {
                project: true,
              },
            },
          },
        });
        /* var array = [...getMediaBySlug];
        array.map((item, index) => {
          if (!item.media.paidState) {
            delete item.media.urlPaid;
          }
        }); */

        const count = await prisma.mediaMap.count({
          where: {
            media: {
              project: {
                slug: slug,
              },
            },
          },
        });
        var pageCount = 0;
        if (count % 50 === 0) {
          pageCount = Math.floor(count / 50);
        } else {
          pageCount = Math.floor(count / 50) + 1;
        }

        if (!getMediaBySlug) {
          return res
            .status(400)
            .json({ message: "Data is empty.", id: "empty" });
        }

        return res.status(200).json([getMediaBySlug, pageCount]);
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
          const getMediaBySlug = await prisma.mediaMap.findMany({
            /*            skip: skip,
            take: take, 
            orderBy: {
              createdAt: "desc",
            },*/
            where: {
              media: {
                project: {
                  slug: slug,
                },
              },
            },
            include: {
              media: {
                include: {
                  project: true,
                },
              },
            },
          });
          var array = [...getMediaBySlug];
          array.map((item, index) => {
            if (!item.media.paidState) {
              delete item.media.urlPaid;
            }
          });

          const count = await prisma.mediaMap.count({
            where: {
              media: {
                project: {
                  slug: slug,
                },
              },
            },
          });
          var pageCount = 0;
          if (count % 50 === 0) {
            pageCount = Math.floor(count / 50);
          } else {
            pageCount = Math.floor(count / 50) + 1;
          }

          if (!getMediaBySlug) {
            return res
              .status(400)
              .json({ message: "Data is empty.", id: "empty" });
          }

          return res.status(200).json([array, pageCount]);
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
          skip: skip,
          take: take,
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
        const count = await prisma.media.count({
          where: {
            isApprove: "PENDING",
            project: {
              slug: slug,
            },
            paidState: false,
          },
        });
        var pageCount = 0;
        if (count % 50 === 0) {
          pageCount = Math.floor(count / 50);
        } else {
          pageCount = Math.floor(count / 50) + 1;
        }
        if (!getMediaBySlug) {
          return res.status(400).json({ message: "Data is empty." });
        }

        return res.status(200).json([getMediaBySlug, pageCount]);
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
          const getMediaBySlug = await prisma.mediaMap.findMany({
            /*            skip: skip,
            take: take, 
            orderBy: {
              createdAt: "desc",
            },*/
            where: {
              media: {
                project: {
                  slug: slug,
                },
              },
            },
            include: {
              media: {
                include: {
                  project: true,
                },
              },
            },
          });
          /* var array = [...getMediaBySlug];
          array.map((item, index) => {
            delete item.media.urlPaid;
          }); */

          const count = await prisma.mediaMap.count({
            where: {
              media: {
                project: {
                  slug: slug,
                },
              },
            },
          });
          var pageCount = 0;
          if (count % 50 === 0) {
            pageCount = Math.floor(count / 50);
          } else {
            pageCount = Math.floor(count / 50) + 1;
          }

          if (!getMediaBySlug) {
            return res
              .status(400)
              .json({ message: "Data is empty.", id: "empty" });
          }

          return res.status(200).json([getMediaBySlug, pageCount]);
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
        const getMediaBySlug = await prisma.mediaMap.findMany({
          /*            skip: skip,
          take: take, 
          orderBy: {
            createdAt: "desc",
          },*/
          where: {
            media: {
              project: {
                slug: slug,
              },
            },
          },
          include: {
            media: {
              include: {
                project: true,
              },
            },
          },
        });
        /* var array = [...getMediaBySlug];
        array.map((item, index) => {
          delete item.media.urlPaid;
        }); */

        const count = await prisma.mediaMap.count({
          where: {
            media: {
              project: {
                slug: slug,
              },
            },
          },
        });
        var pageCount = 0;
        if (count % 50 === 0) {
          pageCount = Math.floor(count / 50);
        } else {
          pageCount = Math.floor(count / 50) + 1;
        }

        if (!getMediaBySlug) {
          return res
            .status(400)
            .json({ message: "Data is empty.", id: "empty" });
        }

        return res.status(200).json([getMediaBySlug, pageCount]);
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
          const getMediaBySlug = await prisma.mediaMap.findMany({
            /*            skip: skip,
            take: take, 
            orderBy: {
              createdAt: "desc",
            },*/
            where: {
              media: {
                project: {
                  slug: slug,
                },
              },
            },
            include: {
              media: {
                include: {
                  project: true,
                },
              },
            },
          });
          /* var array = [...getMediaBySlug];
          array.map((item, index) => {
            delete item.media.urlPaid;
          }); */

          const count = await prisma.mediaMap.count({
            where: {
              media: {
                project: {
                  slug: slug,
                },
              },
            },
          });
          var pageCount = 0;
          if (count % 50 === 0) {
            pageCount = Math.floor(count / 50);
          } else {
            pageCount = Math.floor(count / 50) + 1;
          }

          if (!getMediaBySlug) {
            return res
              .status(400)
              .json({ message: "Data is empty.", id: "empty" });
          }

          return res.status(200).json([getMediaBySlug, pageCount]);
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
        const getMediaBySlug = await prisma.mediaMap.findMany({
          /*            skip: skip,
          take: take, 
          orderBy: {
            createdAt: "desc",
          },*/
          where: {
            media: {
              project: {
                slug: slug,
              },
            },
          },
          include: {
            media: {
              include: {
                project: true,
              },
            },
          },
        });
        /* var array = [...getMediaBySlug];
        array.map((item, index) => {
          delete item.media.urlPaid;
        }); */

        const count = await prisma.mediaMap.count({
          where: {
            media: {
              project: {
                slug: slug,
              },
            },
          },
        });
        var pageCount = 0;
        if (count % 50 === 0) {
          pageCount = Math.floor(count / 50);
        } else {
          pageCount = Math.floor(count / 50) + 1;
        }

        if (!getMediaBySlug) {
          return res
            .status(400)
            .json({ message: "Data is empty.", id: "empty" });
        }

        return res.status(200).json([getMediaBySlug, pageCount]);
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
            skip: skip,
            take: take,
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
          const count = await prisma.media.count({
            where: {
              isApprove: "REJECT",
              project: {
                slug: slug,
              },
              paidState: false,
            },
          });
          var pageCount = 0;
          if (count % 50 === 0) {
            pageCount = Math.floor(count / 50);
          } else {
            pageCount = Math.floor(count / 50) + 1;
          }
          if (!getMediaBySlug) {
            return res
              .status(400)
              .json({ message: "Data is empty.", id: "empty" });
          }

          return res.status(200).json([getMediaBySlug, pageCount]);
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
          skip: skip,
          take: take,
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
        const count = await prisma.media.count({
          where: {
            project: {
              slug: slug,
            },
            paidState: true,
          },
        });
        var pageCount = 0;
        if (count % 50 === 0) {
          pageCount = Math.floor(count / 50);
        } else {
          pageCount = Math.floor(count / 50) + 1;
        }
        if (!getMediaBySlug) {
          return res.status(400).json({ message: "Data is empty." });
        }

        return res.status(200).json([getMediaBySlug, pageCount]);
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
            skip: skip,
            take: take,
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
          const count = await prisma.media.count({
            where: {
              project: {
                slug: slug,
              },
              paidState: true,
            },
          });
          var pageCount = 0;
          if (count % 50 === 0) {
            pageCount = Math.floor(count / 50);
          } else {
            pageCount = Math.floor(count / 50) + 1;
          }
          if (!getMediaBySlug) {
            return res
              .status(400)
              .json({ message: "Data is empty.", id: "empty" });
          }

          return res.status(200).json([getMediaBySlug, pageCount]);
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
  allowedHttpMethod("GET")
  /*   addRequestId,
  addUserIdAndRole */
)(getMedia);
