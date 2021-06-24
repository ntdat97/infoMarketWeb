import { Header } from "../../components/common/Header";
import { LayoutUser } from "../../components/layout/LayoutUser";
import { MainUser } from "../../components/layout/MainUser";
import { HeaderContributeUser } from "../../components/userContribute/HeaderContributeUser";
import { MainContributeUser } from "../../components/userContribute/MainContributeUser";
import SideBar from "../../components/common/SideBar";
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
  return (
    <>
      <LayoutUser
        header={<Header />}
        sidebar={<SideBar />}
        main={
          <MainUser
            subHeader={<HeaderContributeUser user={user} />}
            content={<MainContributeUser user={user} />}
          />
        }
      />
    </>
  );
};

export default MyContribute;
