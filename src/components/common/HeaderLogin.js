import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MenuUser } from "./MenuUser";
import { NewProjectDropdown } from "./NewProjectDropdown";
import { useAuth } from "../../fb/auth";
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
import { firebaseClient } from "../../fb/firebaseClient";
export function HeaderLogin({ user, isScroll, isSticky }) {
  const [slideNav, setSlideNav] = useState("translate-y-0");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const path = router.pathname;
  useEffect(() => {
    var threshold = 0;
    let lastScrollY = window.pageYOffset;
    let ticking = false;
    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      setSlideNav(scrollY > lastScrollY ? "-translate-y-44" : "translate-y-0");
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [slideNav]);
  async function getTokenResult() {
    const getToken = await firebaseClient
      .auth()
      .currentUser.getIdTokenResult(true);
    if (getToken.claims.role) {
      if (getToken?.claims.role[0] === "ADMIN") {
        setIsAdmin(true);
      }
    }
  }

  useEffect(() => {
    getTokenResult();
  }, [user]);
  return (
    <>
      <div
        className={
          "mt-[-1px]  px-10 py-2 bg-white shadow-md z-20 duration-300 transform translate " +
          (isSticky && " sticky top-0 right-0 ") +
          (isScroll && slideNav)
        }
      >
        <div className=" flex justify-between items-center">
          <div className="flex flex-row ">
            <Link href="/">
              <a className="mr-16">
                <img src="/trove-icon.png" className="h-[45px] w-[45px]" />
              </a>
            </Link>

            <div className="flex flex-row   h-full items-center justify-center">
              <Link href="/">
                <a
                  className="p-1 pr-4 border-r  border-gray-500"
                  /*  style={{
                  borderBottomColor: path === "/" ? "#21b532" : "white",
                }} */
                >
                  {/* {path == "/" ? (
                  <RiFileTextFill size={30} fill="#21b532" />
                ) : (
                  <RiFileTextLine size={30} fill="gray" />
                )}
 */}
                  <div
                    className=" font-semibold text-lg text-center border-b py-1"
                    style={{
                      color: path === "/" ? "black" : "#5c5c5c",
                      borderBottomColor: path === "/" ? "#21b532" : "white",
                      fontWeight: path === "/" ? "700" : "600",
                    }}
                  >
                    <span className="">Tất cả dự án</span>
                  </div>
                </a>
              </Link>

              <Link href="/my-projects/all">
                <a
                  className=" p-1 text-center pl-4 pr-4  border-r border-gray-500"
                  /* style={{
                  borderColor:
                    path == "/my-projects/all" ? "#21b532" : "#e6e6e6",
                }} */
                >
                  {/*  {path == "/my-projects/all" ? (
                  <RiFileUserFill size={30} fill="#21b532" />
                ) : (
                  <RiFileUserLine size={30} fill="gray" />
                )} */}

                  <div
                    className="text-[#5c5c5c] font-semibold text-lg text-center py-1   border-b"
                    style={{
                      color:
                        path.includes("my-projects") == true
                          ? "black"
                          : "#5c5c5c",
                      borderBottomColor:
                        path.includes("my-projects") == true
                          ? "#21b532"
                          : "white",
                      fontWeight:
                        path.includes("my-projects") == true ? "700" : "600",
                    }}
                  >
                    Dự án của tôi
                  </div>
                </a>
              </Link>
              <Link href="/my-contribute/all">
                <a
                  className=" p-1 text-center pl-4"
                  /* style={{
                    borderColor:
                      path.includes("my-contribute") == true
                        ? "#21b532"
                        : "#e6e6e6",
                  }} */
                >
                  <div
                    className="text-[#5c5c5c] font-semibold text-lg text-center py-1 border-b"
                    style={{
                      color:
                        path.includes("my-contribute") == true
                          ? "black"
                          : "#5c5c5c",
                      borderBottomColor:
                        path.includes("my-contribute") == true
                          ? "#21b532"
                          : "white",
                      fontWeight:
                        path.includes("my-contribute") == true ? "700" : "600",
                    }}
                  >
                    Đóng góp của tôi
                  </div>
                </a>
              </Link>
            </div>
          </div>
          <div className="items-center flex flex-row">
            <NewProjectDropdown />
            <MenuUser user={user} isAdmin={isAdmin} />
          </div>
        </div>
      </div>
    </>
  );
}
