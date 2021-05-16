import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { genSlug } from "../../../libs/slugify";
import { NextApiResponse } from "next";
import { isAdmin } from "../../../libs/middleware/utils/isAdmin";

const setAdminAPI = async (req: any, res: NextApiResponse) => {
  const slug = req.query.slug;
  console.log(slug);
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const role = decoded.role;
  const getProfile = await prisma.user.findFirst({
    where: {
      username: slug,
    },
  });
  try {
    await firebaseAdmin.auth().setCustomUserClaims(getProfile.id, {
      role: ["ADMIN"],
    });
    const setAdmin = await prisma.user.update({
      where: {
        username: slug,
      },
      data: {
        role: "ADMIN",
      },
    });
    return res.status(200).send(setAdmin);
  } catch (error) {
    console.log(error);
  }
};

export default use(allowedHttpMethod("GET"))(setAdminAPI);
