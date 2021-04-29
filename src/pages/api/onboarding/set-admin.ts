import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { genSlug } from "../../../libs/slugify";
import { NextApiResponse } from "next";
import { isAdmin } from "../../../libs/middleware/utils/isAdmin";

const OnboardingWelcomeAPI = async (req: any, res: NextApiResponse) => {
  try {
    await firebaseAdmin.auth().setCustomUserClaims(req.uid, {
      role: ["ADMIN"],
    });
    const setAdmin = await prisma.user.update({
      where: {
        id: req.uid,
      },
      data: {
        role: "ADMIN",
      },
    });
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
