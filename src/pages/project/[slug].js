import { LayoutUser } from "../../components/layout/LayoutUser";
import { MainUser } from "../../components/layout/MainUser";
import { ProjectDetail } from "../../components/project/ProjectDetail";
import { Header } from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import { Loading } from "../../components/common/Loading";
import { Redirect } from "../../components/common/Redirect";
import { useAuth } from "../../fb/auth";
import React from "react";

const PostIndexPage = () => {
  const { user } = useAuth();

  return (
    <>
      <LayoutUser
        shadow={true}
        header={<Header />}
        sidebar={<SideBar />}
        main={
          <MainUser
            /* subHeader={<HeaderPostsUser user={user} />} */
            content={<ProjectDetail user={user} />}
          />
        }
      />
    </>
  );
};

export default PostIndexPage;
