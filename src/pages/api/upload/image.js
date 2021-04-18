import nextConnect from "next-connect";
import multer from "multer";
import { NextApiResponse } from "next";
import { nanoid } from "nanoid";

const fileId = nanoid(8);

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads/images",
    filename: (req, file, cb) => cb(null, `${fileId}-${file.originalname}`),
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

apiRoute.use(upload.array("image"));

apiRoute.post((req, res) => {
  // console.log(req.files);

  res.status(200).json({
    success: "1",
    file: {
      url: `/uploads/images/${req.files[0].filename}`,
    },
  });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
