import { Header } from "../components/common/Header";
import SideBar from "../components/common/SideBar";
import HomePage from "../components/homePage/HomePage";
import { MainUser } from "../components/layout/MainUser";
import { LayoutUser } from "../components/layout/LayoutUser";
import React, { useEffect } from "react";
import { useAuth } from "../fb/auth";
import { HeaderGuess } from "../components/common/HeaderGuess";
export default function Home() {
  return (
    <>
      <LayoutUser
        header={<Header />}
        sidebar={<SideBar />}
        main={
          <MainUser
            /*             subHeader={<HeaderPostsUser user={user} />} */
            content={<HomePage />}
          />
        }
      />
    </>
  );
}
