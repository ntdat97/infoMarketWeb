import React, { useEffect } from "react";
import Profile from "../../components/profile/Profile";
import Login from "../../components/profile/Login";
import { useAuth } from "../../fb/auth";
import { firebaseClient } from "../../fb/firebaseClient";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import { useRouter } from "next/router";
export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  console.log(user);
  async function createUser() {
    const token = await user.getIdToken();
    const response = await fetch("/api/onboarding/welcome", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    if (response.ok) {
      await firebaseClient.auth().currentUser.getIdTokenResult(true);
      router.push("/profile");
    }
  }
  useEffect(() => {
    if (!user) return;
    createUser();
  }, [user]);
  return (
    <>
      {user !== null && (
        <>
          {user === false ? (
            <>
              <Header />
              <div className="flex flex-row ">
                <div className="w-1/6 sticky border-r border-[#e6e6e6] top-16 self-start h-auto ">
                  <SideBar />
                </div>
                <div className="flex w-11/12 ">
                  <Login />
                </div>
              </div>
            </>
          ) : (
            <>
              <Header />
              <div className="flex flex-row ">
                <div className="w-1/6 sticky top-16 border-r border-[#e6e6e6] self-start h-auto ">
                  <SideBar />
                </div>
                <div className="flex w-11/12 ">
                  <Profile />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
