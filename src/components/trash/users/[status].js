import { HeaderProjectsAdmin } from "../../adminProject/HeaderProjectsAdmin";
import { MainProjectsAdmin } from "../../adminProject/MainProjectsAdmin";
import { HeaderAdmin } from "../../adminComponents/HeaderAdmin";
import { LayoutAdmin } from "../../adminComponents/LayoutAdmin";
import { MainAdmin } from "../../adminComponents/MainAdmin";
import { SidebarAdmin } from "../../adminComponents/SidebarAdmin";
import { Loading } from "../../common/Loading";
import { Redirect } from "../../common/Redirect";
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

  return (
    <>
      <LayoutAdmin
        header={<HeaderAdmin user={user} />}
        sidebar={<SidebarAdmin user={user} />}
        main={
          <MainAdmin
            subHeader={<HeaderProjectsAdmin user={user} />}
            content={<MainProjectsAdmin user={user} />}
          />
        }
      />
    </>
  );
};

export default PostIndexPage;
