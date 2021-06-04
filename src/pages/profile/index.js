import React, { useEffect } from "react";

import { MainUser } from "../../components/layout/MainUser";
import { LayoutUser } from "../../components/layout/LayoutUser";

import Profile from "../../components/profile/Profile";
import Login from "../../components/profile/Login";
import { useAuth } from "../../fb/auth";
import { firebaseClient } from "../../fb/firebaseClient";
import { Header } from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import { useRouter } from "next/router";
export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  async function createUser() {
    const token = await user.getIdToken();
    const response = await fetch("/api/onboarding/welcome", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      router.push("/profile");
    }
  }
  useEffect(() => {
    if (!user) return;

    /*     if (user?.userState === "BANNED") return; */
    createUser();
  }, [user]);
  /*   if (user?.userState === "BANNED") {
    return <div>USER BANNED</div>;
  } */
  return (
    <>
      {user !== null && (
        <>
          {user === false ? (
            <>
              <LayoutUser
                shadow={false}
                header={<Header />}
                sidebar={<SideBar />}
                main={
                  <MainUser
                    /*             subHeader={<HeaderPostsUser user={user} />} */
                    content={<Login />}
                  />
                }
              />
            </>
          ) : (
            <>
              <LayoutUser
                shadow={false}
                header={<Header />}
                sidebar={<SideBar />}
                main={
                  <MainUser
                    /*             subHeader={<HeaderPostsUser user={user} />} */
                    content={<Profile />}
                  />
                }
              />
            </>
          )}
        </>
      )}
    </>
  );
}
