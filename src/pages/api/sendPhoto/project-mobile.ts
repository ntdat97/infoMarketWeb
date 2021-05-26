import { Project, Media } from "@prisma/client";
import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { use } from "../../../libs/middleware/nextMiddleware";
import prisma from "../../../libs/prisma";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import { genSlug } from "../../../libs/slugify";
import { NextApiResponse } from "next";
import { nanoid } from "nanoid";
const google = require("@google-cloud/storage");
const storage = new google.Storage();
var Jimp = require("jimp");
const sendPhoto = async (req: any, res: NextApiResponse) => {
  try {
    const data = req.body;
    const cloneData = data;
    var getMediaBySlugWatermark = [...cloneData.data.values];
    for await (const item of getMediaBySlugWatermark) {
      const ORIGINAL_IMAGE = item.urlPaid;
      const LOGO = process.env.BASE_MEDIA_URL + "/trove-markwater.png";

      const FILENAME = "D:/hoc/LuanVan/nextjs/infomarket/public/test.jpg";

      const main = async () => {
        const [image, logo] = await Promise.all([
          Jimp.read(ORIGINAL_IMAGE)
            .then((image) => {
              return image.quality(90).resize(Jimp.AUTO, 1000); // set JPEG quality
            })
            .catch((error) => console.log(error)),
          Jimp.read(LOGO),
        ]);
        return image.composite(logo, 0, 0, [
          {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacitySource: 0.8,
            opacityDest: 1,
          },
        ]);
      };
      await main().then((image) => {
        image.write(FILENAME);
      });

      const watermarkFile = nanoid(12);
      item.url = `https://storage.googleapis.com/infomarket-bbb0f.appspot.com/${watermarkFile}.jpg`;
      const uploadFile = async () => {
        await storage
          .bucket("infomarket-bbb0f.appspot.com")
          .upload("D:/hoc/LuanVan/nextjs/infomarket/public/test.jpg", {
            destination: `${watermarkFile}.jpg`,
          });
      };

      uploadFile().catch((error) => {
        res.status(400).json({
          success: "0",
          data: error,
        });
      });
    }
    console.log(getMediaBySlugWatermark);
    const createMedia = await prisma.media.createMany({
      data: [...getMediaBySlugWatermark],
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
// });  (image) =>
//      image.getBase64(Jimp.AUTO, function (err, src) {
//      getMediaBySlugWatermark[i].url = src;
//  })

// const addTopics = await prisma.profile.update({
//   where: {
//     userId: req.uid,
//   },
//   data: {
//     followed_topics: { connect: req.body.topics },
//   },
// });

export default use(allowedHttpMethod("POST"))(sendPhoto);
