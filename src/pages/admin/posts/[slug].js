import { HeaderAdmin } from "../../../components/admin/HeaderAdmin";
import { LayoutAdmin } from "../../../components/admin/LayoutAdmin";
import { MainAdmin } from "../../../components/admin/MainAdmin";
import { HeaderPostsAdmin } from "../../../components/admin/post/HeaderPostsAdmin";
import { MainPostsAdmin } from "../../../components/admin/post/MainPostsAdmin";
import { SidebarAdmin } from "../../../components/admin/SidebarAdmin";
import { Loading } from "../../../components/common/Loading";
import { Redirect } from "../../../components/common/Redirect";
import { useAuth } from "../../../fb/auth";
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
      <LayoutAdmin
        header={<HeaderAdmin user={user} />}
        sidebar={<SidebarAdmin user={user} />}
        main={
          <MainAdmin
            subHeader={<HeaderPostsAdmin user={user} />}
            content={<MainPostsAdmin user={user} />}
          />
        }
      />
    </>
  );
};

export default PostIndexPage;
