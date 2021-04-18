import React from "react";
import Profile from "../../components/profile/Profile";
import Login from "../../components/profile/Login";
import { useAuth } from "../../fb/auth";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <>
      {user !== null && (
        <>
          {user === false ? (
            <>
              <Header />
              <div className="flex flex-row ">
                <div className="w-1/6 sticky border-r border-[#e6e6e6] top-16 self-start h-auto ">
                  <Sidebar />
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
                  <Sidebar />
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
