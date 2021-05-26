import nextConnect from "next-connect";
import multer from "multer";
import * as express from "express";
import { NextApiResponse } from "next";
import { nanoid } from "nanoid";
import MulterGoogleCloudStorage from "multer-cloud-storage";
const fileId = nanoid(16);
const decode = (x) => {
  x = x.replace(/\+/g, "-");
  x = decodeURIComponent(x);
  return x;
};
const apiRoute = nextConnect({
  onError(error, req, res: NextApiResponse) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});
const upload = multer({
  storage: new MulterGoogleCloudStorage({
    filename: (req, file, cb) =>
      cb(null, `${fileId}-${decode(file.originalname)}`),
  }),
});
apiRoute.post(upload.any(), (req, res) => {
  console.log(req.files);
  res.json(req.files);
});
export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
