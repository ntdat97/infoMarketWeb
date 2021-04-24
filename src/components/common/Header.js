import React, { useEffect, useState } from "react";
import Link from "next/link";
export default function Header() {
  const [slideNav, setSlideNav] = useState("translate-y-0");
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
  return (
    <>
      <div
        className={
          "mt-[-1px] sticky top-0 right-0 px-10 py-2 bg-white shadow-md z-20 duration-300 transform translate " +
          slideNav
        }
      >
        <div className=" flex flex-row justify-between items-center">
          <Link href="/">
            <a>
              <img src="/icon.png" className="h-[45px] w-[45px]" />
            </a>
          </Link>
          <Link href="/new">
            <a className="text-center bg-gray-300 justify-center items-center rounded-md h-full p-2.5">
              <div className="">Thêm dự án mới</div>
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}
