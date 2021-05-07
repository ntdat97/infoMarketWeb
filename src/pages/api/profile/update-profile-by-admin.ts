import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { NextApiResponse } from "next";

const UpdatePofileAPI = async (req: any, res: NextApiResponse) => {
  const slug = req.query.slug;
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const role = decoded.role;
  const data = req.body.data.values;
  if (role[0] === "ADMIN") {
    const updateProfile = await prisma.user.update({
      where: {
        username: slug,
      },
      data: {
        bio: data.bio,
        website: data.website,
        name: data.displayName,
        photoURL: data.avatarURL,
      },
    });

    const updateFirebaseProfile = await firebaseAdmin
      .auth()
      .updateUser(req.uid, {
        displayName: data.displayName,
      });

    /* console.log(req.picture, data.avatarURL); */

    if (data.photoURL !== req.picture) {
      await firebaseAdmin.auth().updateUser(req.uid, {
        photoURL: data.avatarURL,
      });
    }

    /*  const claims = (await firebaseAdmin.auth().getUser(req.uid)).customClaims;
    await firebaseAdmin.auth().setCustomUserClaims(req.uid, {
      ...claims,
      username: data.username,
      flag_is_setting_profile: true,
    }); */

    return res.status(201).send([updateProfile, updateFirebaseProfile]);
  } else {
    return res.status(201).send({ message: "You are not authourize" });
  }
};

export default use(
  allowedHttpMethod("POST"),
  addRequestId,
  addUserIdAndRole
)(UpdatePofileAPI);
