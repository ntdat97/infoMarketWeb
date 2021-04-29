import { HeaderUser } from "../../components/userContribute/HeaderUser";
import { LayoutUser } from "../../components/userContribute/LayoutUser";
import { MainUser } from "../../components/userContribute/MainUser";
import { HeaderPostsUser } from "../../components/userContribute/post/HeaderPostsUser";
import { MainPostsUser } from "../../components/userContribute/post/MainPostsUser";
import { SidebarUser } from "../../components/userContribute/SidebarUser";
import SideBar from "../../components/common/SideBar";
import Header from "../../components/common/Header";
import { Loading } from "../../components/common/Loading";
import { Redirect } from "../../components/common/Redirect";
import { useAuth } from "../../fb/auth";
import React from "react";

const MyContribute = () => {
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

export default MyContribute;
