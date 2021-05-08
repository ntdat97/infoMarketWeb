import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { genSlug } from "../../../libs/slugify";
import { NextApiResponse } from "next";

const OnboardingWelcomeAPI = async (req: any, res: NextApiResponse) => {
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.uid,
      },
    });
    if (user) {
      console.log("welcome back");
      return res.status(201).send(user);
    } else {
      const welcomeUser = await prisma.user.create({
        data: {
          id: decoded.uid,
          email: decoded.email,
          providers: decoded.firebase.sign_in_provider,
          name: decoded.name,
          role: "USER",
          username: genSlug(decoded.name),
          photoURL: decoded.picture,
        },
      });
      await firebaseAdmin.auth().setCustomUserClaims(decoded.uid, {
        flag_is_save_user: true,
        role: ["USER"],
        username: decoded.username,
        userState: "ACTIVE",
      });
      return res.status(201).send(welcomeUser);
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

export default use(allowedHttpMethod("GET"))(OnboardingWelcomeAPI);
