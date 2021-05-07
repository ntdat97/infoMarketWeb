import React, { useEffect } from "react";

import { MainUser } from "../../../components/layout/MainUser";
import { LayoutUser } from "../../../components/layout/LayoutUser";

import ProfileUserEditByAdmin from "../../../components/profile/ProfileUserEditByAdmin";
import Login from "../../../components/profile/Login";
import { useAuth } from "../../../fb/auth";
import { firebaseClient } from "../../../fb/firebaseClient";
import { Header } from "../../../components/common/Header";
import SideBar from "../../../components/common/SideBar";
import { useRouter } from "next/router";
export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <>
      <LayoutUser
        header={<Header />}
        sidebar={<SideBar />}
        main={
          <MainUser
            /*             subHeader={<HeaderPostsUser user={user} />} */
            content={<ProfileUserEditByAdmin />}
          />
        }
      />
    </>
  );
}
