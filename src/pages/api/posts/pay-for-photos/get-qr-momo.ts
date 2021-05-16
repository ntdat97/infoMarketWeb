import { firebaseAdmin } from "../../../../fb/firebaseAdmin";
import prisma from "../../../../libs/prisma";
import { use } from "../../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../../libs/middleware/utils/allowedHttpMethod";
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const GetQRMOMO = async (req: any, res: NextApiResponse) => {
  /*   const slug = req.query.slug as string; */
  const authValue = req.headers.authorization;
  const token = authValue.replace("Bearer ", "");
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  const role = decoded.role;
  try {
    const req = await fetch(
      "https://momofree.apimienphi.com/api/QRCode?phone=0931275909&amount=1000&note=1.000đ",
      {
        headers: {
          ContentType: "application/json",
        },
      }
    );
    console.log(req);
    const data = await req.json();
    console.log(data);
    /* if (!getMediaBySlug) {
          return res
            .status(400)
            .json({ message: "Can get QRR", id: "empty" });
        } */
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: "0",
      data: error,
    });
  }
};

export default use(allowedHttpMethod("GET"))(GetQRMOMO);
