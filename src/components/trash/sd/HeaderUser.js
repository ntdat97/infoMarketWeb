import Link from "next/link";
import React from "react";
import { MenuUser } from "./MenuUser";

export const HeaderUser = ({ user }) => {
  return (
    <>
      <div className="flex justify-between items-center h-12 border-b m-auto px-6">
        <div>
          <Link href="/">
            <a>
              <img src="/icon.png" alt="icon.png" className="w-8" />
            </a>
          </Link>
        </div>
        <div>
          <MenuUser user={user} />
        </div>
      </div>
    </>
  );
};
