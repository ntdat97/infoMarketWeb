import { HeaderUser } from "../../components/userProject/HeaderUser";
import { LayoutUser } from "../../components/userProject/LayoutUser";
import { MainUser } from "../../components/userProject/MainUser";
import { HeaderPostsUser } from "../../components/userProject/post/HeaderPostsUser";
import { MainPostsUser } from "../../components/userProject/post/MainPostsUser";
import { SidebarUser } from "../../components/userProject/SidebarUser";
import SideBar from "../../components/common/SideBar";
import Header from "../../components/common/Header";
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

  user.getIdToken().then((data) => {
    // console.log(data);
  });

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
