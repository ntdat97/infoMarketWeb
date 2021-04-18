import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  RiFolderUserLine,
  RiFolderLine,
  RiFileTextFill,
  RiFileTextLine,
  RiFileUserLine,
  RiFileUserFill,
  RiAccountCircleLine,
} from "react-icons/ri";
export default function SideBar() {
  const router = useRouter();
  const path = router.pathname;
  return (
    <div className="flex flex-col   h-full">
      <Link href="/">
        <a
          className="flex flex-col p-1  mb-[10px] border-b border-t border-[#e6e6e6] pb-3 pt-3 items-center justify-center"
          style={{
            borderBottomColor: path == "/" ? "#21b532" : "#e6e6e6",
          }}
        >
          {path == "/" ? (
            <RiFileTextFill size={30} fill="#21b532" />
          ) : (
            <RiFileTextLine size={30} fill="gray" />
          )}

          <div className="text-[#5c5c5c] font-semibold text-lg text-center">
            Dự án
          </div>
        </a>
      </Link>
      <Link href="#">
        <a
          className=" flex flex-col p-1 justify-center mb-[10px] items-center border-b pb-3 text-center"
          style={{ borderColor: path == "/my-project" ? "#21b532" : "#e6e6e6" }}
        >
          {path == "/my-project" ? (
            <RiFileUserFill size={30} fill="#21b532" />
          ) : (
            <RiFileUserLine size={30} fill="gray" />
          )}

          <div className="text-[#5c5c5c] font-semibold text-lg text-center">
            Dự án của tôi
          </div>
        </a>
      </Link>
      <Link href="/profile">
        <a
          className="flex flex-col p-1 justify-center  items-center border-b pb-3 text-cente"
          style={{ borderColor: path == "/profile" ? "#21b532" : "#e6e6e6" }}
        >
          {path == "/profile" ? (
            <RiAccountCircleLine size={30} fill="#21b532" />
          ) : (
            <RiAccountCircleLine size={30} fill="gray" />
          )}

          <div className="text-[#5c5c5c] font-semibold text-lg">Profile</div>
        </a>
      </Link>
    </div>
  );
}
