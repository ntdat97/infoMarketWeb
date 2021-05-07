import { HeaderContributeAdmin } from "../../../components/admin/adminContribute/HeaderContributeAdmin";
import { MainContributeAdmin } from "../../../components/admin/adminContribute/MainContributeAdmin";
import { HeaderAdmin } from "../../../components/admin/adminComponents/HeaderAdmin";
import { LayoutAdmin } from "../../../components/admin/adminComponents/LayoutAdmin";
import { MainAdmin } from "../../../components/admin/adminComponents/MainAdmin";
import { SidebarAdmin } from "../../../components/admin/adminComponents/SidebarAdmin";
import { Loading } from "../../../components/common/Loading";
import { Redirect } from "../../../components/common/Redirect";
import { useAuth } from "../../../fb/auth";
import React from "react";

const AdminContribute = () => {
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
            subHeader={<HeaderContributeAdmin user={user} />}
            content={<MainContributeAdmin user={user} />}
          />
        }
      />
    </>
  );
};

export default AdminContribute;
