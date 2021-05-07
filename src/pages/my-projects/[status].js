import { Header } from "../../components/common/Header";
import { LayoutUser } from "../../components/layout/LayoutUser";
import { MainUser } from "../../components/layout/MainUser";
import { HeaderPostsUser } from "../../components/userMyProject/HeaderPostsUser";
import { MainPostsUser } from "../../components/userMyProject/MainPostsUser";
import SideBar from "../../components/common/SideBar";
import { Loading } from "../../components/common/Loading";
import { Redirect } from "../../components/common/Redirect";
import { useAuth } from "../../fb/auth";
import React from "react";

const PostIndexPage = () => {
  const { user } = useAuth();
  if (user === null) {
    return <Loading />;
  }

  if (user === false) {
    return <Redirect />;
  }

  return (
    <>
      <LayoutUser
        header={<Header />}
        sidebar={<SideBar />}
        main={
          <MainUser
            subHeader={<HeaderPostsUser user={user} />}
            content={<MainPostsUser user={user} />}
          />
        }
      />
    </>
  );
};

export default PostIndexPage;
