import React from "react";
import { LayoutUser } from "../../../../components/layout/LayoutUser";
import { MainUser } from "../../../../components/layout/MainUser";
import { Header } from "../../../../components/common/Header";
import SideBar from "../../../../components/common/SideBar";
import { Loading } from "../../../../components/common/Loading";
import { Redirect } from "../../../../components/common/Redirect";
import { GoogleMap } from "../../../../components/map/GoogleMap";
import { useAuth } from "../../../../fb/auth";

const PhotoCollectionPage = () => {
  const { user } = useAuth();
  if (user === null) {
    return <Loading />;
  }

  if (user === false) {
    return <Redirect />;
  }

  return <GoogleMap />;
};
export default PhotoCollectionPage;
