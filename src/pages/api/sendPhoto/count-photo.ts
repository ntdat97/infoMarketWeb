import { use } from "../../../libs/middleware/nextMiddleware";
import { addRequestId } from "../../../libs/middleware/utils/addRequestId";
import { addUserIdAndRole } from "../../../libs/middleware/utils/addUserIdAndRole";
import { allowedHttpMethod } from "../../../libs/middleware/utils/allowedHttpMethod";
import prisma from "../../../libs/prisma";
import { NextApiResponse } from "next";

const PostsCountByStatusAPI = async (req: any, res: NextApiResponse) => {
  try {
    const data = req.body;
    const cloneData = JSON.parse(data);

    const totalSentByUser = await prisma.media.count({
      where: {
        userId: cloneData.data.values.userId,
        projectId: cloneData.data.values.projectId,
      },
    });
    console.log(totalSentByUser);
    return res.status(200).send(totalSentByUser);
  } catch (error) {
    console.log(error);
  }
};

export default use(allowedHttpMethod("POST"))(PostsCountByStatusAPI);
