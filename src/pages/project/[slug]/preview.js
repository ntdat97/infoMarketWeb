import { Loading } from "../../../components/common/Loading";
import { Redirect } from "../../../components/common/Redirect";
import { MainUser } from "../../../components/layout/MainUser";
import SideBar from "../../../components/common/SideBar";
import { LayoutUser } from "../../../components/layout/LayoutUser";
import { HeaderPreview } from "../../../components/admin/HeaderPreview";
import Project from "../../../components/layout/Project";
import { useAuth } from "../../../fb/auth";
import React from "react";
export const PostPreviewPage = () => {
  const { user } = useAuth();

  if (user === null) {
    return <Loading />;
  }

  if (user === false) {
    return <Redirect />;
  }

  return (
    <LayoutUser
      header={<HeaderPreview user={user} />}
      sidebar={<SideBar />}
      main={
        <MainUser
          /* subHeader={<HeaderPostsUser user={user} />} */
          content={<Project />}
        />
      }
    />
  );
};

export default PostPreviewPage;
