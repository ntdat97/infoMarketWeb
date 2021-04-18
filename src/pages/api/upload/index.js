import nextConnect from "next-connect";
import multer from "multer";
import { NextApiResponse } from "next";
import { nanoid } from "nanoid";
import MulterGoogleCloudStorage from "multer-cloud-storage";

const fileId = nanoid(16);
const decode = (x) => {
  x = x.replace(/\+/g, "-");
  x = decodeURIComponent(x);
  return x;
};
const upload = multer({
  storage: new MulterGoogleCloudStorage({
    filename: (req, file, cb) =>
      cb(null, `${fileId}-${decode(file.originalname)}`),
  }),
}); /* cb(null, `${fileId}-${(console, log(decode(file.originalname)))}`), */
const uploadLocal = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) =>
      cb(null, `${fileId}-${decode(file.originalname)}`),
  }),
});
const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array("files"));
apiRoute.post((req, res) => {
  res.status(200).json({
    status: "success",
    data: req.files.map((file) => ({
      ...file,
      url: `${process.env.BASE_MEDIA_URL}/uploads/${file.filename}`,
    })),
  });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
