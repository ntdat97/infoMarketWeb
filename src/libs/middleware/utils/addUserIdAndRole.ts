import Boom from "@hapi/boom";
import { firebaseAdmin } from "../../../fb/firebaseAdmin";
import { NextMiddleware } from "../nextMiddleware";

export const addUserIdAndRole: NextMiddleware<{
  uid: string;
  name: string;
  role: string;
  username: string;
  email: string;
  providers: string;
  picture: string;
}> = async (req, res, next) => {
  const authValue = req.headers.authorization;

  if (!authValue) {
    return res
      .status(401)
      .send(Boom.unauthorized("req.headers.authorization is empty"));
  }
  const token = authValue.replace("Bearer ", "");

  let decoded;
  try {
    console.log();
    decoded = await firebaseAdmin.auth().verifyIdToken(token);
  } catch (error) {
    console.log(error);

    return res.status(401).send(Boom.unauthorized());
  }

  const userId: string = decoded.uid;

  req.uid = userId;
  req.name = decoded.name;
  req.email = decoded.email;
  req.providers = decoded.firebase.sign_in_provider;
  req.role = decoded.role;
  req.picture = decoded.picture;

  await next();
};
