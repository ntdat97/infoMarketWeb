import React, { useEffect } from "react";
import Login from "../../../components/profile/Login";
import { MainUser } from "../../../components/layout/MainUser";
import { LayoutUser } from "../../../components/layout/LayoutUser";
import { Header } from "../../../components/common/Header";
import SideBar from "../../../components/common/SideBar";
import { PublicUser } from "../../../components/profile/PublicUser";
import { useRouter } from "next/router";
export default function ProfileViewer() {
  return (
    <>
      <LayoutUser
        header={<Header />}
        sidebar={<SideBar />}
        main={
          <MainUser
            /*             subHeader={<HeaderPostsUser user={user} />} */
            content={<PublicUser />}
          />
        }
      />
    </>
  );
}
/* 
<Text style={{backgroundColor: 'white'}}>sad</Text>
*/
