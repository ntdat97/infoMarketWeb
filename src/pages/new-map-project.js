import React from "react";
import { Header } from "../components/common/Header";
import SideBar from "../components/common/SideBar";
import { MainUser } from "../components/layout/MainUser";
import { LayoutUser } from "../components/layout/LayoutUser";
import CreateProjectMap from "../components/project/CreateProjectMap";

import { Redirect } from "../components/common/Redirect";
import { Loading } from "../components/common/Loading";
import { useAuth } from "../fb/auth";

const NewPostPage = () => {
  const { user } = useAuth();
  if (user === null) {
    return <Loading />;
  }

  if (user === false) {
    return <Redirect />;
  }

  return (
    <LayoutUser
      header={<Header />}
      sidebar={<SideBar />}
      main={
        <MainUser
          /*             subHeader={<HeaderPostsUser user={user} />} */
          content={<CreateProjectMap />}
        />
      }
    />
  );
};
export default NewPostPage;
