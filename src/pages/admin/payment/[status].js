import { HeaderAdmin } from "../../../components/admin/adminComponents/HeaderAdmin";
import { LayoutAdmin } from "../../../components/admin/adminComponents/LayoutAdmin";
import { MainAdmin } from "../../../components/admin/adminComponents/MainAdmin";
import { HeaderPayment } from "../../../components/admin/adminPayment/HeaderPayment";
import { MainPayment } from "../../../components/admin/adminPayment/MainPayment";
import { SidebarAdmin } from "../../../components/admin/adminComponents/SidebarAdmin";
import { Loading } from "../../../components/common/Loading";
import { Redirect } from "../../../components/common/Redirect";
import { useAuth } from "../../../fb/auth";
import React from "react";

const adminMember = () => {
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
            subHeader={<HeaderPayment user={user} />}
            content={<MainPayment user={user} />}
          />
        }
      />
    </>
  );
};

export default adminMember;
