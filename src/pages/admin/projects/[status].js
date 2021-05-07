import { HeaderAdmin } from "../../../components/admin/adminComponents/HeaderAdmin";
import { LayoutAdmin } from "../../../components/admin/adminComponents/LayoutAdmin";
import { MainAdmin } from "../../../components/admin/adminComponents/MainAdmin";
import { HeaderProjectsAdmin } from "../../../components/admin/adminProject/HeaderProjectsAdmin";
import { MainProjectsAdmin } from "../../../components/admin/adminProject/MainProjectsAdmin";
import { SidebarAdmin } from "../../../components/admin/adminComponents/SidebarAdmin";
import { Loading } from "../../../components/common/Loading";
import { Redirect } from "../../../components/common/Redirect";
import { useAuth } from "../../../fb/auth";
import React from "react";

const AdminProject = () => {
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
            subHeader={<HeaderProjectsAdmin user={user} />}
            content={<MainProjectsAdmin user={user} />}
          />
        }
      />
    </>
  );
};

export default AdminProject;
