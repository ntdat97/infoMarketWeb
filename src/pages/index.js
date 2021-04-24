import Card from "../components/project/Card";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { Loading } from "../components/common/Loading";
import React, { useEffect } from "react";
import { useAuth } from "../fb/auth";
import { firebaseClient } from "../fb/firebaseClient";
import { useRouter } from "next/router";

import { useAsyncList } from "@react-stately/data";
export default function Home() {
  let list = useAsyncList({
    async load() {
      let res = await fetch("/api/publicPost/all", {
        headers: {
          ContentType: "application/json",
        },
      });
      let json = await res.json();

      return { items: json };
    },
  });
  return (
    <>
      <Header />
      <div className="flex flex-row ">
        <div className="w-1/6 sticky top-16 border-r border-[#e6e6e6]  self-start">
          <Sidebar />
        </div>
        <div className=" w-11/12">
          <div className="max-w-[1108px] mx-auto ">
            <div className="grid-col-1 md:grid-cols-2 grid p-1.5 mb-4 ">
              {list.isLoading ? (
                <Loading />
              ) : (
                <>
                  {list.items.length > 0 ? (
                    list.items.map((item, index) => (
                      <Card data={item} index={index} />
                    ))
                  ) : (
                    <p>Chưa có Project</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
