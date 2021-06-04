import Link from "next/link";
import React from "react";
import { MenuAdmin } from "./MenuAdmin";

export const HeaderAdmin = ({ user }) => {
  return (
    <>
      <div className="flex justify-between items-center h-12 border-b m-auto px-6 shadow-md">
        <div>
          <Link href="/">
            <a>
              <img
                src="/trove-icon.png"
                alt="icon.png"
                className="h-[45px] w-[45px]"
              />
            </a>
          </Link>
        </div>
        <div>
          <MenuAdmin user={user} />
        </div>
      </div>
    </>
  );
};
