import React from "react";
import Register from "../../components/profile/Register";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
function RegisterPage() {
  return (
    <>
      <Header />
      <div className="flex flex-row ">
        <div className="w-1/6 sticky border-r border-[#e6e6e6] top-16 self-start h-auto ">
          <Sidebar />
        </div>
        <div className="flex w-11/12 ">
          <Register />
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
