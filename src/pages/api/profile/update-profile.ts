import { firebaseAdmin } from 'fb/firebaseAdmin';
import { use } from 'libs/middleware/nextMiddleware';
import { addRequestId } from 'libs/middleware/utils/addRequestId';
import { addUserIdAndRole } from 'libs/middleware/utils/addUserIdAndRole';
import { allowedHttpMethod } from 'libs/middleware/utils/allowedHttpMethod';
import prisma from 'libs/prisma';
import { NextApiResponse } from 'next';

const UpdatePofileAPI = async (req: any, res: NextApiResponse) => {
  const { data } = req.body;

  const updateProfile = await prisma.profile.update({
    where: {
      userId: req.uid,
    },
    data: {
      bio: data.bio,
      education: data.education,
      educationMajors: data.educationMajors,
      employerName: data.employerName,
      employerTitle: data.employerTitle,
      employerURL: data.employerURL,
      facebookURL: data.facebookURL,
      instagramURL: data.instagramURL,
      linkedInURL: data.linkedInURL,
      youtubeURL: data.youtubeURL,
      isDisplayEmail: data.isDisplayEmail,
      localtion: data.localtion,
      workExperience: data.workExperience,
      user: {
        update: {
          username: data.username,
          photoURL: data.photoURL,
        },
      },
    },
  });

  const updateFirebaseProfile = await firebaseAdmin.auth().updateUser(req.uid, {
    displayName: data.name,
  });

  // console.log(req.picture, data.photoURL );
  
  if (data.photoURL !==req.picture) {
    await firebaseAdmin.auth().updateUser(req.uid, {
      photoURL: `${process.env.BASE_MEDIA_URL}${data.photoURL}`,
    });
  }

  const claims = (await firebaseAdmin.auth().getUser(req.uid)).customClaims;
  await firebaseAdmin.auth().setCustomUserClaims(req.uid, {
    ...claims,
    username: data.username,
    flag_is_setting_profile: true,
  });

  return res.status(201).send([updateProfile, updateFirebaseProfile]);
};

export default use(
  allowedHttpMethod('POST'),
  addRequestId,
  addUserIdAndRole
)(UpdatePofileAPI);
