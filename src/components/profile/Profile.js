import React, { useState, useEffect, useLayoutEffect } from "react";
import { IoEarth } from "react-icons/io5";
import { useAuth } from "../../fb/auth";
/* 
import { firebase } from "../firebase/config"; */
/* import Login from "./Login"; */
export default function Profile() {
  const { signout } = useAuth();
  return (
    <div className="flex flex-col w-full bg-[#F8F8F8] max-w-[1108px] mx-auto ">
      <div className="px-[22px] bg-white">
        <div className="flex flex-row mt-3">
          <div className="w-1/12 items-center py-3">
            <img src="/avatar.png" style={{ width: 80, height: 80 }} />
          </div>
          <div className="w-10/12 flex flex-col  justify-center">
            <div style={{ paddingBottom: 5, fontSize: 18 }}>
              email@gmail.com
            </div>
            <div style={{ fontSize: 18, color: "#868483" }}>87 redivs</div>
          </div>
        </div>
        <div
          style={{ paddingHorizontal: 22, paddingVertical: 10, fontSize: 15 }}
        >
          Description
        </div>
        <div className="flex flex-row  py-3 items-center">
          <IoEarth className="mr-3" size={24} />
          {/* <Icon
            name="link-variant"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          /> */}
          <div>Google.com</div>
        </div>
        <a>
          <div
            className="py-2 mb-2.5"
            style={{ color: "#1B9284", fontSize: 18 }}
          >
            Edit
          </div>
        </a>
      </div>
      <div className=" py-3 px-[22px]">Project Activites</div>
      <div className="flex flex-row bg-white px-[22px] py-3 justify-between border-b border-[#EEEEEE]">
        <div style={{}}>
          <div style={{ paddingVertical: 4 }}>12</div>
          <div style={{ paddingVertical: 4 }}>Sent</div>
        </div>
        <div style={{}}>
          <div style={{ paddingVertical: 4 }}>5</div>
          <div style={{ paddingVertical: 4 }}>Approved</div>
        </div>
        <div style={{}}>
          <div style={{ paddingVertical: 4 }}>0</div>
          <div style={{ paddingVertical: 4 }}>Created</div>
        </div>
      </div>
      <a className="flex flex-row px-[22px] py-3 justify-between items-center bg-white">
        <div style={{}}>
          <div>All activity</div>
        </div>
        {/* <Icon name="chevron-right" size={24} color="#969696" /> */}
      </a>
      <buttom onClick={signout}>dangxuat</buttom>
    </div>
  );
}
/* 
<Text style={{backgroundColor: 'white'}}>sad</Text>
*/
