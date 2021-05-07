import React, { useEffect, useState } from "react";
import { IoEarth } from "react-icons/io5";
import { useRouter } from "next/router";
import { LoadingSmall } from "../common/Loading";
import { useAsyncList } from "@react-stately/data";
export function PublicUser() {
  const router = useRouter();
  const slug = router.query.slug;
  let list = useAsyncList({
    async load() {
      let res = await fetch(`/api/profile/user-public?username=${slug}`, {
        headers: {
          ContentType: "application/json",
        },
      });
      let json = await res.json();
      return { items: json };
    },
  });
  useEffect(() => {
    list.reload();
  }, [slug]);
  return (
    <>
      {list.isLoading ? (
        <LoadingSmall />
      ) : (
        <>
          {list.items.length > 0 ? (
            <div className="flex flex-col w-full bg-[#F8F8F8] max-w-[1108px] mx-auto ">
              <div className="px-[22px] bg-white">
                <div className="flex flex-row mt-3">
                  <div className="w-1/12 items-center py-3">
                    <img
                      src={
                        list.items[0].photoURL
                          ? list.items[0].photoURL
                          : "/avatar.png"
                      }
                      style={{ width: 80, height: 80 }}
                      className="rounded-full"
                    />
                  </div>
                  <div className="w-10/12 flex flex-col  justify-center">
                    <div style={{ paddingBottom: 5, fontSize: 18 }}>
                      {list.items[0].name}
                    </div>
                    <div style={{ fontSize: 18, color: "#868483" }}>
                      {list.items[0].email}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    paddingHorizontal: 22,
                    paddingVertical: 10,
                    fontSize: 15,
                  }}
                >
                  "{list.items[0].bio}"
                </div>
                <div className="flex flex-row  py-3 items-center">
                  <IoEarth className="mr-3" size={24} />
                  <div>Google.com</div>
                </div>
              </div>
              <div className=" py-3 px-[22px]">Project Activites</div>
              <div className="flex flex-row bg-white px-[22px] py-3 justify-between border-b border-[#EEEEEE]">
                <div className="flex justify-center items-center flex-col">
                  <div style={{ paddingVertical: 4 }}>
                    {list.items[0]._count.media}
                  </div>
                  <div style={{ paddingVertical: 4 }}>Ảnh đã gởi</div>
                </div>
                <div className="flex justify-center items-center flex-col">
                  <div style={{ paddingVertical: 4 }}>{list.items[1]}</div>
                  <div style={{ paddingVertical: 4 }}>Ảnh được chấp nhận</div>
                </div>
                <div className="flex justify-center items-center flex-col">
                  <div style={{ paddingVertical: 4 }}>
                    {list.items[0]._count.project}
                  </div>
                  <div style={{ paddingVertical: 4 }}>Dự án đã tạo</div>
                </div>
              </div>
            </div>
          ) : (
            <p>Empty...</p>
          )}
        </>
      )}
    </>
  );
}
