import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MenuUser } from "./MenuUser";
import { useAuth } from "../../fb/auth";
import { firebaseClient } from "../../fb/firebaseClient";
export function HeaderLogin({ user }) {
  const [slideNav, setSlideNav] = useState("translate-y-0");
  const [isAdmin, setIsAdmin] = useState(false);
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
    if (getToken && getToken?.claims.role[0] === "ADMIN") {
      setIsAdmin(true);
    }
  }

  useEffect(() => {
    getTokenResult();
  }, [user]);
  return (
    <>
      <div
        className={
          "mt-[-1px] sticky top-0 right-0 px-10 py-2 bg-white shadow-md z-20 duration-300 transform translate " +
          slideNav
        }
      >
        <div className=" flex justify-between items-center">
          <Link href="/">
            <a>
              <img src="/icon.png" className="h-[45px] w-[45px]" />
            </a>
          </Link>

          <div className="items-center flex flex-row">
            {/* <Link href="/new">
              <a className="text-center shadow bg-[#21b532] justify-center items-center rounded-xl h-full py-1 px-2">
                <div className="text-white">Thêm mới</div>
              </a>
            </Link> */}
            <MenuUser user={user} isAdmin={isAdmin} />
          </div>
        </div>
      </div>
    </>
  );
}
