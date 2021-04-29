import React from "react";
import { Loading } from "../../../components/common/Loading";
import { Redirect } from "../../../components/common/Redirect";
import { PhotoCollection } from "../../../components/project/PhotoCollection";
import { useAuth } from "../../../fb/auth";

const PhotoCollectionPage = () => {
  const { user } = useAuth();
  if (user === null) {
    return <Loading />;
  }

  if (user === false) {
    return <Redirect />;
  }

  return <PhotoCollection />;
};
export default PhotoCollectionPage;
