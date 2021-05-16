import { Project, Media } from "@prisma/client";
import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { use } from "../../../libs/middleware/nextMiddleware";
import prisma from "../../../libs/prisma";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import { genSlug } from "../../../libs/slugify";
import { NextApiResponse } from "next";
import nextConnect from "next-connect";
const sendPhoto = async (req: any, res: NextApiResponse) => {
  try {
    const data = req.body;
    const cloneData = JSON.parse(data);
    const createMedia = await prisma.media.createMany({
      data: [...cloneData.data.values],
    });
    res.status(200).json({
      success: "1",
      data: createMedia,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: "0",
      data: error,
    });
  }

  return;
};

// const createProfile = await prisma.profile.create({
//   data: {
//     userId: req.uid,
//   },
// });

// const addTopics = await prisma.profile.update({
//   where: {
//     userId: req.uid,
//   },
//   data: {
//     followed_topics: { connect: req.body.topics },
//   },
// });

export default use(allowedHttpMethod("POST"))(sendPhoto);
