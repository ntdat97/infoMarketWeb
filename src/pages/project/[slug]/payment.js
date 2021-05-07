import React from "react";

import { LayoutUser } from "../../../components/layout/LayoutUser";
import { MainUser } from "../../../components/layout/MainUser";
import { Header } from "../../../components/common/Header";
import SideBar from "../../../components/common/SideBar";

import EditProject from "../../../components/project/EditProject";
import { Redirect } from "../../../components/common/Redirect";
import { Loading } from "../../../components/common/Loading";
import { useAuth } from "../../../fb/auth";

const Edit = () => {
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
          /* subHeader={<HeaderPostsUser user={user} />} */
          content={<EditProject />}
        />
      }
    />
  );
};
export default Edit;
