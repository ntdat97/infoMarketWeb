import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { genSlug } from "../../../libs/slugify";
import { NextApiResponse } from "next";

const OnboardingWelcomeAPI = async (req: any, res: NextApiResponse) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.uid,
      },
    });
    if (user) {
      console.log("welcome back");
      return res.status(201).send(user);
    } else {
      const welcomeUser = await prisma.user.create({
        data: {
          id: req.uid,
          email: req.email,
          providers: req.providers,
          name: req.name,
          role: "USER",
          username: genSlug(req.name),
          photoURL: req.picture,
        },
      });
      await firebaseAdmin.auth().setCustomUserClaims(req.uid, {
        flag_is_save_user: true,
        role: ["USER"],
        username: req.uid,
      });
    }

    return;
  } catch (error) {
    console.log(error);
  }

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
};

export default use(
  allowedHttpMethod("POST"),
  addRequestId,
  addUserIdAndRole
)(OnboardingWelcomeAPI);
