import React, { useState, useEffect, useLayoutEffect } from "react";
import { IoEarth } from "react-icons/io5";
import { useAuth } from "../../fb/auth";
import { firebaseClient } from "../../fb/firebaseClient";
import { useAsyncList } from "@react-stately/data";
/* 
import { firebase } from "../firebase/config"; */
/* import Login from "./Login"; */
export default function Profile() {
  const { user } = useAuth();
  const { signout } = useAuth();

  const [initValues, setInitValues] = useState({
    id: user.id,
    email: user.email,
    role: "USER",
    name: "",
    providers: "",
    username: "",
    photoURL: user.photoURL,
    website: null,
    bio: null,
  });
  async function setAdmin() {
    const token = await user.getIdToken();
    const response = await fetch("/api/onboarding/set-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    if (response.ok) {
      await firebaseClient.auth().currentUser.getIdTokenResult(true);
    }
    const getTokenResult = await firebaseClient
      .auth()
      .currentUser.getIdTokenResult(true);
    console.log(getTokenResult);
  }
  let me = useAsyncList({
    async load() {
      const getTokenResult = await firebaseClient
        .auth()
        .currentUser.getIdTokenResult(true);
      console.log(getTokenResult);
      let res = await fetch("/api/profile/me", {
        headers: {
          Authorization: `Bearer ${await user.getIdToken(true)}`,
        },
      });

      let json = await res.json();
      setInitValues(json[0]);
      return { items: json };
    },
  });
  return (
    <div className="flex flex-col w-full bg-[#F8F8F8] max-w-[1108px] mx-auto ">
      <div className="px-[22px] bg-white">
        <div className="flex flex-row mt-3">
          <div className="w-1/12 items-center py-3">
            <img
              src={user.photoURL ? user.photoURL : "/avatar.png"}
              style={{ width: 80, height: 80 }}
              className="rounded-full"
            />
          </div>
          <div className="w-10/12 flex flex-col  justify-center">
            <div style={{ paddingBottom: 5, fontSize: 18 }}>
              {user.email && user.email}
            </div>
            <div style={{ fontSize: 18, color: "#868483" }}>87 redivs</div>
          </div>
        </div>
        <div
          style={{ paddingHorizontal: 22, paddingVertical: 10, fontSize: 15 }}
        >
          "{initValues.bio}"
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
      <button onClick={signout}>dangxuat</button>
      <button onClick={setAdmin}>set me admin</button>
    </div>
  );
}
/* 
<Text style={{backgroundColor: 'white'}}>sad</Text>
*/
